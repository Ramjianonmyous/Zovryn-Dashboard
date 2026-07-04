const getDateRange=(period='monthly')=>{const n=new Date();let s,e,ps,pe;
if(period==='weekly'){s=new Date(n);s.setDate(n.getDate()-7);e=new Date(n);ps=new Date(s);ps.setDate(s.getDate()-7);pe=new Date(s)}
else if(period==='yearly'){s=new Date(n.getFullYear(),0,1);e=new Date(n);ps=new Date(n.getFullYear()-1,0,1);pe=new Date(n.getFullYear()-1,11,31)}
else{s=new Date(n.getFullYear(),n.getMonth(),1);e=new Date(n);ps=new Date(n.getFullYear(),n.getMonth()-1,1);pe=new Date(n.getFullYear(),n.getMonth(),0)}
return{startDate:s,endDate:e,previousStart:ps,previousEnd:pe}};
const formatCurrency=(a,c='USD')=>new Intl.NumberFormat('en-US',{style:'currency',currency:c}).format(a);
const timeAgo=(date)=>{const s=Math.floor((new Date()-new Date(date))/1000);const i=[{l:'year',s:31536000},{l:'month',s:2592000},{l:'week',s:604800},{l:'day',s:86400},{l:'hour',s:3600},{l:'minute',s:60}];for(const x of i){const c=Math.floor(s/x.s);if(c>=1)return c+' '+x.l+(c>1?'s':'')+' ago'}return 'Just now'};
module.exports={getDateRange,formatCurrency,timeAgo};