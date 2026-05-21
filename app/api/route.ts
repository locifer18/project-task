export function GET(){
    try{
        
        const user = db.user.findAll({
            include: {
                name: true,
                email: true,
                phone: true,
            }
        })
    } catch{
        
    }
}