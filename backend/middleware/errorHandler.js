const errorHandler=(err,req,res,next)=>{let e={...err};e.message=err.message;
if(process.env.NODE_ENV==='development')console.error(err);
if(err.name==='CastError'){e.message='Not found';return res.status(404).json({success:false,message:e.message})}
if(err.code===11000){const f=Object.keys(err.keyValue)[0];e.message='Duplicate '+f;return res.status(400).json({success:false,message:e.message})}
if(err.name==='ValidationError'){e.message=Object.values(err.errors).map(v=>v.message).join(', ');return res.status(400).json({success:false,message:e.message})}
res.status(err.statusCode||500).json({success:false,message:e.message||'Server Error'})};
module.exports=errorHandler;