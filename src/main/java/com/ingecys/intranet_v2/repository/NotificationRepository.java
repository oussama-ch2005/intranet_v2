package com.ingecys.intranet_v2.repository;

import com.ingecys.intranet_v2.entity.Notification;
import com.ingecys.intranet_v2.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification,Long> {
    //notif non lu
    @Query("select n from Notification n where n.user.id=:userId and n.lu=false order by n.dateNotif")
    List<Notification> findByUserIdAndLuFalseOrderByDateNotifDesc(Long userId);
    //toutes les notification d'un utilisateur
    @Query("SELECT n FROM Notification n WHERE n.user.id = :userId ORDER BY n.dateNotif DESC")
    List<Notification> findByUserIdOrderByDateNotifDesc(Long userId);


}
