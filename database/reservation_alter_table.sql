alter table reservation 
add column returned_vehicle_cond varchar(1000) DEFAULT NULL;

alter table reservation 
add column feedback_post_return varchar(1000) DEFAULT NULL;

alter table reservation
add column reason_for_cancel varchar(1000) DEFAULT NULL;
