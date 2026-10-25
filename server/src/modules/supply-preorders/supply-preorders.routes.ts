import { Router } from "express";
import { randomUUID } from "node:crypto";
import db from "../../database/database.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { requireRoles } from "../../middleware/role.middleware.js";

const router = Router();
router.use(authMiddleware);
const SELECT = `SELECT sp.*,p.code AS producer_code,p.full_name AS producer_name
 FROM supply_preorders sp JOIN producers p ON p.id=sp.producer_id`;
const validDate = (v: string) => /^\d{4}-\d{2}-\d{2}$/.test(v) &&
 !Number.isNaN(Date.parse(v + "T00:00:00Z")) && new Date(v + "T00:00:00Z").toISOString().slice(0,10) === v;

router.get("/supply-preorders", requireRoles("PRODUCTEUR","POINT_FOCAL","ADMIN","GESTIONNAIRE"), (req,res) => {
 const user=req.user!;
 let rows;
 if (user.role === "ADMIN" || user.role === "GESTIONNAIRE") rows=db.prepare(SELECT+" ORDER BY sp.id DESC LIMIT 500").all();
 else if (user.role === "POINT_FOCAL") rows=db.prepare(SELECT+` WHERE sp.producer_id IN
 (SELECT producer_id FROM point_focal_producers WHERE point_focal_user_id=?) ORDER BY sp.id DESC LIMIT 500`).all(user.id);
 else rows=db.prepare(SELECT+` WHERE sp.producer_id IN
 (SELECT producer_id FROM producer_user_links WHERE user_id=?) ORDER BY sp.id DESC LIMIT 500`).all(user.id);
 res.json({success:true,preorders:rows});
});

router.post("/supply-preorders", requireRoles("PRODUCTEUR","POINT_FOCAL"), (req,res) => {
 const user=req.user!; const body=req.body || {};
 const producerId=Number(body.producerId);
 const quantity=Number(body.quantityKg);
 const product=String(body.product||"").trim();
 const start=String(body.availableFrom||"").trim(); const end=String(body.availableUntil||"").trim();
 const technical=String(body.technicalNotes||"").trim(); const sanitary=String(body.sanitaryNotes||"").trim();
 if (!Number.isSafeInteger(producerId)||producerId<=0||!Number.isFinite(quantity)||quantity<=0||quantity>100000000||
 !product||product.length>100||!validDate(start)||!validDate(end)||end<start||end<new Date().toISOString().slice(0,10)||
 technical.length>2000||sanitary.length>2000) {
   res.status(400).json({success:false,message:"Données invalides: producteur, quantité, période ou caractéristiques."}); return;
 }
 const linked=user.role==="PRODUCTEUR" ? db.prepare("SELECT 1 FROM producer_user_links WHERE user_id=? AND producer_id=?").get(user.id,producerId)
 : db.prepare("SELECT 1 FROM point_focal_producers WHERE point_focal_user_id=? AND producer_id=?").get(user.id,producerId);
 if (!linked) {res.status(403).json({success:false,message:"Producteur non rattaché à votre compte."});return;}
 const code="APP-"+new Date().toISOString().slice(0,10).replace(/-/g,"")+"-"+randomUUID().slice(0,8).toUpperCase();
 db.prepare(`INSERT INTO supply_preorders (code,producer_id,created_by_user_id,product,quantity_kg,available_from,available_until,technical_notes,sanitary_notes)
 VALUES (?,?,?,?,?,?,?,?,?)`).run(code,producerId,user.id,product,quantity,start,end,technical,sanitary);
 res.status(201).json({success:true,code,message:"Précommande transmise pour validation."});
});

router.patch("/supply-preorders/:id/status", requireRoles("ADMIN","GESTIONNAIRE"), (req,res) => {
 const id=Number(req.params.id), status=String(req.body?.status||"").toUpperCase();
 const notes=String(req.body?.reviewNotes||"").trim();
 if (!Number.isSafeInteger(id)||id<=0||!["VALIDATED","REJECTED"].includes(status)||notes.length>2000) {
  res.status(400).json({success:false,message:"Validation invalide."});return;
 }
 const result=db.prepare(`UPDATE supply_preorders SET status=?,review_notes=?,reviewed_by_user_id=?,updated_at=CURRENT_TIMESTAMP
 WHERE id=? AND status='PENDING'`).run(status,notes||null,req.user!.id,id);
 if (!result.changes) {res.status(409).json({success:false,message:"Précommande inexistante ou déjà traitée."});return;}
 res.json({success:true,message:"Statut mis à jour."});
});
export default router;
