package com.ingecys.intranet_v2.service;

import com.ingecys.intranet_v2.DTO.MessageRequest;
import com.ingecys.intranet_v2.DTO.MessageResponde;
import com.ingecys.intranet_v2.entity.*;
import com.ingecys.intranet_v2.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final ConversationRepository conversationRepository;
    private final UserRepository userRepository;
    private final MentionRepository mentionRepository;
    private final PieceJointRepository  pieceJointeRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private  final NotificationRepository notificationRepository;

    @Transactional
    public MessageResponde envoiMessage(Long conversationId, MessageRequest messageRequest,String emailSender) {

        Conversation conv=conversationRepository.findById(conversationId)
                .orElseThrow(()->new RuntimeException("conversation introuvable"));
        User sender= userRepository.findByEmail(emailSender)
                .orElseThrow(()->new RuntimeException("user not found"));

       User receiver=null;
       if(messageRequest.getReceiverId()!=null){
           receiver=userRepository.findById(messageRequest.getReceiverId())
                   .orElseThrow(()->new RuntimeException("user not found"));
       }


        // sauvgarde des message
        Message msg=Message.builder()
                .conversation(conv)
                .sender(sender)
                .receiver(receiver) //null or user
                .content(messageRequest.getContent())
                .build();
        msg=messageRepository.save(msg);


        // sauvegarde des pieces joients

        List<PieceJointe> piecesJointes=new ArrayList<>();
        if(messageRequest.getPieceJointeRequests()!=null){

            for (MessageRequest.PieceJointeRequest pj: messageRequest.getPieceJointeRequests()) {
                PieceJointe pieceJointe=PieceJointe.builder()
                        .message(msg)
                        .nomFichier(pj.getNomFichier())
                        .url(pj.getUrl())
                        .typeFichier(pj.getTypeFichier())
                        .tailleKo(pj.getTailleKo())
                        .build();
                piecesJointes.add(pieceJointeRepository.save(pieceJointe));
            }
        }

        //sauvgarder les mentions & cree les notif
        List<String> mentionsPrenoms=new ArrayList<>();
        if(messageRequest.getId_mentiones()!=null){

            for(Long userId:messageRequest.getId_mentiones()){



                User mentioned=userRepository.findById(userId)
                        .orElseThrow(()->new RuntimeException("user not found"));



                mentionRepository.save(Mention.builder()
                        .message(msg)
                        .mentionner(sender)
                        .user(mentioned)
                        .build()
                );
                notificationRepository.save(Notification.builder()
                        .user(mentioned)
                        .message(msg)
                        .type("MENTION")
                        .build());

                messagingTemplate.convertAndSendToUser(
                        mentioned.getEmail(),//destinateire
                        "/queue/notifications",//canal prive
                        "vous avez ete mentionne par "+sender.getPrenom()
                );

                mentionsPrenoms.add(mentioned.getPrenom());


            }
        }
        //construire la reponse
        List<MessageResponde.PieceJointeDto> pieceJointeDtos=piecesJointes.stream()
                .map(pj->MessageResponde.PieceJointeDto.builder()
                        .id((long) pj.getId())
                        .nomFichier(pj.getNomFichier())
                        .url(pj.getUrl())
                        .TypeFichier(pj.getTypeFichier())
                        .build()

                ).toList();


        MessageResponde.ReceiverDto receiverDto=null;
        if(receiver!=null){
            receiverDto=MessageResponde.ReceiverDto.builder()
                    .id(receiver.getId())
                    .nom(receiver.getNom())
                    .prenom(receiver.getPrenom())
                    .build();
        }

        //construire  la reponse

        MessageResponde responde=MessageResponde.builder()
                .id(msg.getId())
                .content(msg.getContent())
                .sent_date(msg.getDateEnvoi())
                .auteur(MessageResponde.AuteurDto.builder()
                        .id(sender.getId())
                        .nom(sender.getNom())
                        .prenom(sender.getPrenom())
                        .email(sender.getEmail())
                        .build()
                ).receiver(receiverDto)
                .pieceJointes(pieceJointeDtos)
                .mentionsPrenoms(mentionsPrenoms)
                .build();
        //diffuser vie websocket
        if(receiver!=null){
            messagingTemplate.convertAndSendToUser(
                    receiver.getEmail(),
                    "/queue/messages",
                    responde
            );
            System.out.println("message prive envoye à "+ receiver.getEmail());
        }else {
            messagingTemplate.convertAndSend("/topic/conversation/"+conversationId,responde);
            System.out.println("message diffuser sur /topic/conversation/"+conversationId);
        }





      return responde;


    }
    @Transactional
    public void supprimerMessage(Long messageId,String emailUser) {

        Message message=messageRepository.findById(messageId)
                .orElseThrow(()->new RuntimeException("message not found"));

        System.out.println("Utilisateur connecté : " + emailUser);
        System.out.println("Auteur du message    : " + message.getSender().getEmail());
        System.out.println("Message ID           : " + message.getId());
        System.out.println("Avant le if");
        if(!message.getSender().getEmail().equals(emailUser)) {
            System.out.println("en le if");
            throw new RuntimeException("Vous ne pouvez supprimer que vos propres messages");
        }
        System.out.println("apres le if");
        System.out.println("avvant save");
        message.setEstSupprime(true);
        System.out.println("apres save");
        messageRepository.save(message);
    }


}
