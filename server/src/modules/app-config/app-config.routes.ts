import { Router } from 'express';
import db from '../../database/database.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { requireRoles } from '../../middleware/role.middleware.js';

const router = Router();
const defaults: Record<string,string> = {
 siteTitle:'Tantsaha Miombona', siteSubtitle:'Valorisation des productions locales',
 siteDescription:'Transformation et commercialisation de produits locaux.',
 primaryColor:'#146c43', accentColor:'#c45427', theme:'light', language:'fr',
 email:'', legalNotice:'Mentions légales à compléter.',
 producerGuide:'Contactez votre point focal pour préparer vos livraisons.',
 customerGuide:'Consultez les produits et stocks puis passez commande.'
};
const keys=Object.keys(defaults);
const read=()=>{
 const rows=db.prepare("SELECT setting_key,setting_value FROM settings WHERE setting_key LIKE 'v02.%'").all() as {setting_key:string;setting_value:string}[];
 const output={...defaults};
 for(const row of rows){const key=row.setting_key.slice(4);if(keys.includes(key))output[key]=row.setting_value;}
 return output;
};
router.get('/public/app-config',(_req,res)=>{res.json({success:true,config:read()});});
router.put('/admin/app-config',authMiddleware,requireRoles('ADMIN'),(req,res)=>{
 const body=req.body;
 if(!body||typeof body!=='object'||Array.isArray(body)){res.status(400).json({success:false,message:'Paramètres invalides'});return;}
 const incoming=Object.entries(body);
 if(incoming.some(([k,v])=>!keys.includes(k)||typeof v!=='string'||v.length>8000)){
  res.status(400).json({success:false,message:'Clé ou valeur invalide (maximum 8000 caractères)'});return;
 }
 const candidate={...read(),...body} as Record<string,string>;
 for(const k of ['primaryColor','accentColor']){
  if(!/^#[0-9a-fA-F]{6}$/.test(candidate[k]||'')){res.status(400).json({success:false,message:'Couleur HEX invalide'});return;}
 }
 if(!['light','dark'].includes(candidate.theme)||!['fr','mg','en'].includes(candidate.language)){
  res.status(400).json({success:false,message:'Langue ou thème non reconnu'});return;
 }
 for(const k of ['siteTitle','siteSubtitle']){
  if(!candidate[k]?.trim()){res.status(400).json({success:false,message:'Titre obligatoire'});return;}
 }
 const put=db.prepare('INSERT INTO settings(setting_key,setting_value) VALUES(?,?) ON CONFLICT(setting_key) DO UPDATE SET setting_value=excluded.setting_value');
 db.transaction(()=>{for(const [k,v] of incoming)put.run('v02.'+k,v);})();
 res.json({success:true,config:read()});
});
export default router;
