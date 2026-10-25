import Tm29ContactSettings from '../components/tm29/Tm29ContactSettings';
import { useEffect, useState } from 'react';
import { platformRequest } from '../services/platform-api';
import '../styles/v02-config.css';

type Configuration={siteTitle:string;siteSubtitle:string;siteDescription:string;primaryColor:string;accentColor:string;theme:string;language:string;email:string;legalNotice:string;producerGuide:string;customerGuide:string};
const names:Record<keyof Configuration,string>={siteTitle:'Nom public',siteSubtitle:'Slogan / sous-titre',siteDescription:'Présentation de l’établissement',primaryColor:'Couleur principale',accentColor:'Couleur secondaire',theme:'Thème',language:'Langue préférée',email:'E-mail public',legalNotice:'Mentions légales',producerGuide:'Guide des producteurs',customerGuide:'Guide des clients'};
const initial:Configuration={siteTitle:'',siteSubtitle:'',siteDescription:'',primaryColor:'#146c43',accentColor:'#c45427',theme:'light',language:'fr',email:'',legalNotice:'',producerGuide:'',customerGuide:''};
export default function AppConfigAdminPage(){
 const [config,setConfig]=useState<Configuration>(initial);
 const [status,setStatus]=useState('Chargement des paramètres…');
 const [saving,setSaving]=useState(false);
 useEffect(()=>{platformRequest<{config:Configuration}>('/public/app-config').then(d=>{setConfig(d.config);setStatus('');}).catch(e=>setStatus(String(e)));},[]);
 const save=async(e:React.FormEvent)=>{e.preventDefault();setSaving(true);setStatus('Enregistrement…');try{const data=await platformRequest<{config:Configuration}>('/admin/app-config',{method:'PUT',authenticated:true,body:config});setConfig(data.config);setStatus('Paramètres enregistrés.');}catch(err){setStatus(err instanceof Error?err.message:String(err));}finally{setSaving(false);}};
 return <main className="v02-config"><h1>Paramètres publics V02</h1><p>Personnalisez l’identité, la présentation, les couleurs et les documents informatifs. La langue préférée ne traduit pas encore automatiquement tous les écrans.</p><form onSubmit={save}><div className="v02-config-grid">{(Object.keys(names) as (keyof Configuration)[]).map(k=><label key={k}><span>{names[k]}</span>{k==='theme'||k==='language'?<select value={config[k]} onChange={e=>setConfig({...config,[k]:e.target.value})}>{(k==='theme'?[['light','Clair'],['dark','Sombre']]:[['fr','Français'],['mg','Malagasy'],['en','English']]).map(([v,n])=><option key={v} value={v}>{n}</option>)}</select>:k==='siteDescription'||k==='legalNotice'||k==='producerGuide'||k==='customerGuide'?<textarea rows={5} value={config[k]} onChange={e=>setConfig({...config,[k]:e.target.value})}/>:<input type={k==='email'?'email':k==='primaryColor'||k==='accentColor'?'color':'text'} value={config[k]} onChange={e=>setConfig({...config,[k]:e.target.value})}/>}</label>)}</div><button disabled={saving} type="submit">{saving?'Enregistrement…':'Enregistrer les paramètres'}</button><p role="status" aria-live="polite">{status}</p></form>
      <Tm29ContactSettings />
    </main>;
}
