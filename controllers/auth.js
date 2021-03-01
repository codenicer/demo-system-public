const bcrypt  = require('bcryptjs')
const jwt = require('jsonwebtoken')
const secrete = process.env.JWT_SECRET;
const db = require('./../models');
const Op = db.Sequelize.Op;
const UserModel = db.user;

module.exports = {

    authenticate: async (req, res) => {
        const {email,password}  =  req.body;
        try{
           const user = await UserModel.findAll({
               where:{
                   // status:{
                   //     [Op.ne]: '1'
                   // },
                   email

               }

            },{plain:true, raw:true});

           if(!user){
               res.status(404).json({msg:'Username and password is invalid'})
           }else{
               console.log('user:', user[0].user_id);
               let isMatch =  bcrypt.compare(password,user[0].password);
               if(isMatch){
                   try{
                       //@todo must create or update on other user related table
                       const ures = await UserModel.update(
                           { status:1},
                           { where: { user_id: {[Op.eq]:user[0].user_id}}}
                       );

                       if(ures){
                           const payload = {user:{user_id:user[0].user_id}};
                           const token = await jwt.sign(payload,secrete,{expiresIn: '12h'});
                            console.log('jwt :', token);
                           if(!token){
                               res.status(400).json({msg:'Unable to generate token'});
                           }else{
                               res.status(200).json({token});
                           }

                       }
                   }catch(e){
                       console.log('Update error on user ',e);
                       res.status(400).json({msg:'Unable to update user record'});
                   }
               }else{
                   res.status(401).json({msg:'Username and password is invalid'});
               }
           }

        }catch(e){
            console.log('Error in authentication.',e);
            res.status(400).json({msg:'Username and password is invalid'});
        }

    }

};
