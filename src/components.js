export const InkCat=({className='',mood=0,alpha=.9})=>{
  const poses=['M50 70 C40...','M55 95 C45...','M40 90 C30...','M60 78 C48...'];
  return (<svg viewBox="0 0 180 140" className={className}><path d={poses[mood%poses.length]} fill="#0b0b0b" opacity={alpha}/></svg>);
};
export const Smudge=({className=''})=>(
  <svg viewBox="0 0 200 120" className={className}><path d="M10,90 C25,20 ..." fill="#0f0f0f" opacity=".08"/></svg>
);