const db = require("../models");
const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Manila");

module.exports = {

    forassignment_count: async req => {
      let {hub_id} = req.query
      hub_id = hub_id.split(',')
      
        try { 
            const [[{count}]] = await db.sequelize.query(
              " SELECT count(`job_id`) as count "+
              " FROM `view_dispatch_for_assignment` AS `view_dispatch_for_assignment` WHERE ((`view_dispatch_for_assignment`.`jobtype` = 'delivery' AND "+
              " `view_dispatch_for_assignment`.`order_status_id` IN (2, 3, 4, 5, 6, 7) AND `view_dispatch_for_assignment`.`delivery_date` = :delivery_date "+
              " AND `view_dispatch_for_assignment`.`hub_id` IN (:hub_id)) OR (`view_dispatch_for_assignment`.`jobtype` = 'cash pickup' AND "+
              " `view_dispatch_for_assignment`.`delivery_date` <= :delivery_date AND `view_dispatch_for_assignment`.`hub_id` IN (:hub_id))) "+
              " ORDER BY `view_dispatch_for_assignment`.`delivery_date` ASC, `view_dispatch_for_assignment`.`delivery_time` ASC LIMIT 0, 1000 ",
             {replacements:{
                hub_id:hub_id,
                delivery_date:moment().format('YYYY-MM-DD')
             }}
            )

            return count;
        } catch (err) {
          console.log("Dispatch Count Controller", err);
          return Promise.reject({ status: 400, msg: "Unable to process request" });
        }
      },


      assignedjob_count: async req =>{
        let {hub_id} = req.query
        hub_id = hub_id.split(',')

          try { 
              const [[{count}]] = await db.sequelize.query(
                " SELECT count(`dispatch_job`.`dispatch_job_id`) AS `count` FROM `dispatch_job` AS `dispatch_job` INNER JOIN `dispatch_job_detail` AS `dispatch_job_details`"+
                " ON `dispatch_job`.`dispatch_job_id` = `dispatch_job_details`.`dispatch_job_id` AND `dispatch_job_details`.`status` = 8 WHERE `dispatch_job`.`status` = '8' "+
                "AND `dispatch_job`.`hub_id` IN (:hub_id)",
               {replacements:{
                  hub_id:hub_id,
               }}
              )
  
              return count;
          } catch (err) {
            console.log("Dispatch Count Controller", err);
            return Promise.reject({ status: 400, msg: "Unable to process request" });
          }
      },


      advancebooking_count: async req =>{

        let {hub_id} = req.query
        hub_id = hub_id.split(',')

          try { 
              const [[{count}]] = await db.sequelize.query(
                "SELECT count(`dispatch_job`.`dispatch_job_id`) AS `count` FROM `dispatch_job` AS `dispatch_job` INNER JOIN `dispatch_job_detail` AS `dispatch_job_details` "+
                "ON `dispatch_job`.`dispatch_job_id` = `dispatch_job_details`.`dispatch_job_id` AND `dispatch_job_details`.`status` = 15 "+
                "WHERE `dispatch_job`.`status` = '15' AND `dispatch_job`.`hub_id` IN ( :hub_id )",
               {replacements:{
                  hub_id:hub_id,
               }}
              )

              return count;
          } catch (err) {
            console.log("Dispatch Count Controller", err);
            return Promise.reject({ status: 400, msg: "Unable to process request" });
          }


      },

}



