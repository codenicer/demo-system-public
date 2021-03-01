'use strict';
module.exports = (sequelize, DataTypes) => {
  const sequence = sequelize.define('sequence', {
    sequence_id: {
        type:DataTypes.INTEGER,
        primaryKey: true
    },
    sequence_name: DataTypes.STRING,
    sequence_value: DataTypes.INTEGER,
  },
  {
        timestamps:false,
        freezeTableName:true,
        underscored:false,
        tableName:'sequence'


      });
    sequence.associate = function(models) {
    // associations can be defined here
        // //sequence.belongsToMany(models.user, { through: models.user_sequence, foreignKey:'sequence_id'});

  };



    sequence.generate_sequence =  async function (sequence_name) {

        if(!sequence_name){
            return Promise.resolve(false);
        }else{
            //check last date updated if not same day start with 0


            const newSeq  = await sequelize.query(`select sequence_value from sequence where DATE(updated_at) < CURDATE()`,
                {type: sequelize.QueryTypes.SELECT});

            console.log('newSeq',newSeq);
            console.log('newSeq',newSeq);
            console.log('newSeq',newSeq);
            console.log('newSeq',newSeq);
            console.log('newSeq',newSeq);
            if(newSeq.length) {
                const result  = await sequelize.query(`update sequence set sequence_value = 1, updated_at=NOW()`);
                if(!result){
                    return Promise.resolve(false)
                }else{
                    console.log('sequence 1',result);
                    return Promise.resolve(1);
                }
            }else{
                const result  = await sequelize.query(`insert into sequence(sequence_name,sequence_value) values('${sequence_name}',1) on duplicate key update sequence_value=LAST_INSERT_ID(sequence_value+1)`)
                if(!result){
                    return Promise.resolve(false)
                }else{
                    console.log('sequence 2',result);
                    return Promise.resolve(result[0]);
                }
            }











        }


    }

  return sequence;
};