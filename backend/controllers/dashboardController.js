const Order=require('../models/Order'),User=require('../models/User'),Product=require('../models/Product');
const getDateRange=(period='monthly')=>{const n=new Date();let s,e,ps,pe;
if(period==='weekly'){s=new Date(n);s.setDate(n.getDate()-7);e=new Date(n);ps=new Date(s);ps.setDate(s.getDate()-7);pe=new Date(s)}
else if(period==='yearly'){s=new Date(n.getFullYear(),0,1);e=new Date(n);ps=new Date(n.getFullYear()-1,0,1);pe=new Date(n.getFullYear()-1,11,31)}
else{s=new Date(n.getFullYear(),n.getMonth(),1);e=new Date(n);ps=new Date(n.getFullYear(),n.getMonth()-1,1);pe=new Date(n.getFullYear(),n.getMonth(),0)}
return{startDate:s,endDate:e,previousStart:ps,previousEnd:pe}};
const growth=(c,p)=>p===0?(c>0?100:0):+((c-p)/p*100).toFixed(1);
exports.getOverview=async(req,res,next)=>{try{const{period='monthly'}=req.query;const{startDate,endDate,previousStart,previousEnd}=getDateRange(period);
const[c,p]=await Promise.all([Order.aggregate([{$match:{createdAt:{$gte:startDate,$lte:endDate}}},{$group:{_id:null,revenue:{$sum:'$totalAmount'},orders:{$sum:1},avg:{$avg:'$totalAmount'}}}]),Order.aggregate([{$match:{createdAt:{$gte:previousStart,$lte:previousEnd}}},{$group:{_id:null,revenue:{$sum:'$totalAmount'},orders:{$sum:1},avg:{$avg:'$totalAmount'}}}])]);
const tc=await User.countDocuments({role:'user'}),pc=await User.countDocuments({role:'user',createdAt:{$lt:startDate}});
const cr=c[0]||{revenue:0,orders:0,avg:0},pr=p[0]||{revenue:0,orders:0,avg:0};
res.json({success:true,data:{revenue:{value:cr.revenue,previous:pr.revenue,growth:growth(cr.revenue,pr.revenue)},orders:{value:cr.orders,previous:pr.orders,growth:growth(cr.orders,pr.orders)},customers:{value:tc,previous:pc,growth:growth(tc,tc-pc)},avgOrderValue:{value:Math.round(cr.avg*100)/100,previous:Math.round(pr.avg*100)/100,growth:growth(cr.avg,pr.avg)}}})}catch(e){next(e)}};
exports.getRevenueChart=async(req,res,next)=>{try{const{period='monthly'}=req.query;const{startDate,endDate}=getDateRange(period);const unit=period==='weekly'?'week':period==='yearly'?'year':'month';
const data=await Order.aggregate([{$match:{createdAt:{$gte:startDate,$lte:endDate},status:{$ne:'cancelled'}}},{$group:{_id:{$dateTrunc:{date:'$createdAt',unit:unit}},revenue:{$sum:'$totalAmount'},orders:{$sum:1}}},{$sort:{_id:1}}]);
res.json({success:true,data:data.map(i=>({date:i._id,revenue:i.revenue,orders:i.orders}))})}catch(e){next(e)}};
exports.getSalesByCategory=async(req,res,next)=>{try{const labels={electronics:'Electronics',clothing:'Clothing',home_garden:'Home & Garden',sports:'Sports',books:'Books',toys:'Toys',food:'Food',other:'Other'};
const colors={electronics:'#22c55e',clothing:'#3b82f6',home_garden:'#8b5cf6',sports:'#f59e0b',books:'#ef4444',toys:'#ec4899',food:'#06b6d4',other:'#64748b'};
const data=await Order.aggregate([{$unwind:'$products'},{$lookup:{from:'products',localField:'products.product',foreignField:'_id',as:'pi'}},{$unwind:{path:'$pi',preserveNullAndEmptyArrays:true}},{$group:{_id:{$ifNull:['$pi.category','other']},revenue:{$sum:{$multiply:['$products.quantity','$products.price']}}}},{$sort:{revenue:-1}}]);
res.json({success:true,data:data.map(i=>({category:labels[i._id]||i._id,value:i.revenue,color:colors[i._id]||'#64748b'}))})}catch(e){next(e)}};
exports.getOrderStats=async(req,res,next)=>{try{const days=parseInt(req.query.days)||7;const s=new Date();s.setDate(s.getDate()-days);
const data=await Order.aggregate([{$match:{createdAt:{$gte:s}}},{$group:{_id:{$dateTrunc:{date:'$createdAt',unit:'day'}},completed:{$sum:{$cond:[{$in:['$status',['completed','delivered']]},1,0]}},pending:{$sum:{$cond:[{$in:['$status',['pending','processing']]},1,0]}}}},{$sort:{_id:1}}]);
res.json({success:true,data:data.map(i=>({date:i._id,completed:i.completed,pending:i.pending}))})}catch(e){next(e)}};
exports.getActivity=async(req,res,next)=>{try{const orders=await Order.find().sort({createdAt:-1}).limit(5).select('orderId customerName status createdAt totalAmount').lean();
const users=await User.find().sort({createdAt:-1}).limit(3).select('name createdAt').lean();
const act=[...orders.map(o=>({type:'order',title:'Order '+o.orderId,message:o.status+' by '+o.customerName,time:o.createdAt,icon:'lucide:shopping-cart',color:o.status==='completed'?'green':o.status==='cancelled'?'red':'blue'})),...users.map(u=>({type:'user',title:'New user',message:u.name+' joined',time:u.createdAt,icon:'lucide:user-plus',color:'blue'}))];
act.sort((a,b)=>b.time-a.time);res.json({success:true,data:act.slice(0,10)})}catch(e){next(e)}};