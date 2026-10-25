import { useEffect, useState, type FormEvent } from "react";
import PageHeader from "../components/layout/PageHeader";
import useAuth from "../hooks/useAuth";
import { platformRequest } from "../services/platform-api";
import { agriService, type ProducerMini } from "../services/agri.service";

type RecordRow={id:number;code:string;producer_name:string;product:string;quantity_kg:number;available_from:string;available_until:string;technical_notes:string;sanitary_notes:string;status:string;review_notes:string|null};
const SupplyPreordersPage=()=>{
 const { user } = useAuth();
 const role=user?.role||""; const reviewer=role==="ADMIN"||role==="GESTIONNAIRE";
 const [rows,setRows]=useState<RecordRow[]>([]);const [producers,setProducers]=useState<ProducerMini[]>([]);
 const [producerId,setProducerId]=useState("");const [product,setProduct]=useState("Tomate");
 const [quantity,setQuantity]=useState("");const [start,setStart]=useState("");const [end,setEnd]=useState("");
 const [technical,setTechnical]=useState("");const [sanitary,setSanitary]=useState("");
 const [busy,setBusy]=useState(false);const [message,setMessage]=useState("");
 const refresh=async()=>{const data=await platformRequest<{preorders:RecordRow[]}>("/supply-preorders",{authenticated:true});setRows(data.preorders);};
 useEffect(()=>{
  void refresh().catch(e=>setMessage(String(e.message||e)));
  if(role==="POINT_FOCAL") void agriService.pointFocalProducers().then(x=>setProducers(x.producers)).catch(e=>setMessage(String(e.message||e)));
  if(role==="PRODUCTEUR") void agriService.producerMe().then(x=>{setProducers([x.producer]);setProducerId(String(x.producer.id));}).catch(e=>setMessage(String(e.message||e)));
 },[role]);
 const submit=async(e:FormEvent)=>{e.preventDefault();setBusy(true);setMessage("");try{
  await platformRequest("/supply-preorders",{method:"POST",authenticated:true,body:{producerId:Number(producerId),product,quantityKg:Number(quantity),availableFrom:start,availableUntil:end,technicalNotes:technical,sanitaryNotes:sanitary}});
  setQuantity("");setTechnical("");setSanitary("");setMessage("Précommande enregistrée, en attente de validation.");await refresh();
 }catch(e){setMessage(e instanceof Error?e.message:"Erreur inconnue");}finally{setBusy(false);}};
 const decide=async(id:number,status:"VALIDATED"|"REJECTED")=>{const reviewNotes=window.prompt("Motif ou observation (facultatif)","");if(reviewNotes===null)return;
  setBusy(true);try{await platformRequest(`/supply-preorders/${id}/status`,{method:"PATCH",authenticated:true,body:{status,reviewNotes}});await refresh();setMessage("Décision enregistrée.");}
  catch(e){setMessage(e instanceof Error?e.message:"Erreur");}finally{setBusy(false);}};
 return <>
  <PageHeader title="Précommandes d'approvisionnement" description="Propositions de livraison des producteurs, par période, soumises à validation." />
  {message&&<div className="card" role="status">{message}</div>}
  {!reviewer&&<form className="card" onSubmit={submit} style={{display:"grid",gap:12,maxWidth:760}}>
   <h3>Proposer une livraison</h3>
   <label>Producteur<select required value={producerId} onChange={e=>setProducerId(e.target.value)}><option value="">Choisir</option>{producers.map(p=><option key={p.id} value={p.id}>{p.code} — {p.fullName}</option>)}</select></label>
   <label>Produit<input required maxLength={100} value={product} onChange={e=>setProduct(e.target.value)}/></label>
   <label>Quantité estimée (kg)<input required type="number" min="0.01" step="0.01" value={quantity} onChange={e=>setQuantity(e.target.value)}/></label>
   <label>Début de disponibilité<input required type="date" value={start} onChange={e=>setStart(e.target.value)}/></label>
   <label>Fin de disponibilité<input required type="date" min={start||undefined} value={end} onChange={e=>setEnd(e.target.value)}/></label>
   <label>Caractéristiques techniques<textarea maxLength={2000} value={technical} onChange={e=>setTechnical(e.target.value)} placeholder="Variété, maturité, conditionnement…"/></label>
   <label>Caractéristiques sanitaires<textarea maxLength={2000} value={sanitary} onChange={e=>setSanitary(e.target.value)} placeholder="Hygiène, traitements, observations…"/></label>
   <button disabled={busy||!producerId} className="btn btn-primary" type="submit">Soumettre à validation</button>
  </form>}
  <div className="card" style={{marginTop:16}}><h3>{reviewer?"Demandes à valider":"Mes précommandes"}</h3>
   <div style={{overflowX:"auto"}}><table style={{width:"100%"}}><thead><tr><th>Code</th><th>Producteur</th><th>Produit / kg</th><th>Période</th><th>Caractéristiques</th><th>Statut</th>{reviewer&&<th>Décision</th>}</tr></thead><tbody>
    {rows.map(r=><tr key={r.id}><td>{r.code}</td><td>{r.producer_name}</td><td>{r.product} / {r.quantity_kg}</td><td>{r.available_from} au {r.available_until}</td><td><small>Tech. : {r.technical_notes||"—"}<br/>Sanitaire : {r.sanitary_notes||"—"}</small></td><td>{r.status}{r.review_notes&&<small> — {r.review_notes}</small>}</td>{reviewer&&<td>{r.status==="PENDING"&&<><button className="btn" disabled={busy} onClick={()=>void decide(r.id,"VALIDATED")}>Valider</button> <button className="btn" disabled={busy} onClick={()=>void decide(r.id,"REJECTED")}>Refuser</button></>}</td>}</tr>)}
   </tbody></table></div>{rows.length===0&&<p>Aucune précommande pour le moment.</p>}
  </div>
 </>;
};
export default SupplyPreordersPage;
