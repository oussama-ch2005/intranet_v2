package com.ingecys.intranet_v2.service;

import com.ingecys.intranet_v2.DTO.MessageRequest;
import com.ingecys.intranet_v2.DTO.MessageResponde;
import com.ingecys.intranet_v2.entity.Conversation;
import com.ingecys.intranet_v2.entity.Mention;
import com.ingecys.intranet_v2.entity.Message;
import com.ingecys.intranet_v2.entity.User;
import com.ingecys.intranet_v2.repository.ConversationRepository;
import com.ingecys.intranet_v2.repository.MentionRepository;
import com.ingecys.intranet_v2.repository.MessageRepository;
import com.ingecys.intranet_v2.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.messaging.simp.SimpMessagingTemplate;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final ConversationRepository conversationRepository;
    private final UserRepository userRepository;
    private final MentionRepository mentionRepository;

    @Transactional
    public MessageResponde envoiMessage(Long conversationId, MessageRequest messageRequest,String emailSender) {

        Conversation conv=conversationRepository.findById(conversationId)
                .orElseThrow(()->new RuntimeException("conversation introuvable"));
        User sender= userRepository.findByEmail(emailSender)
                .orElseThrow(()->new RuntimeException("user not found"));

        Message msg=Message.builder()
                .conversation(conv)
                .sender(sender)
                .content(messageRequest.getContent())
                .build();
        msg=messageRepository.save(msg);

        if(messageRequest.getId_mentiones()!=null){

            for(Long userId:messageRequest.getId_mentiones()){



                User mentioned=userRepository.findById(userId)
                        .orElseThrow(()->new RuntimeException("user not found"));



                mentionRepository.save(Mention.builder()
                        .message(msg)
                        .user(mentioned)
                        .build()
                );


            }
        }
         MessageResponde responde=MessageResponde.builder()
                 .id(msg.getId())
                 .content(msg.getContent())
                 .sent_date(msg.getDateEnvoi())
                 .auteur(MessageResponde.AuteurDto.builder()
                         .id(sender.getId())
                         .nom(sender.getNom())
                         .prenom(sender.getPrenom())
                         .build())
                 .build();


        return responde;


    }
    @Transactional
    public void supprimerMessage(Long messageId,String emailUser) {

        Message message=messageRepository.findById(messageId)
                .orElseThrow(()->new RuntimeException("message not found"));
        if(!message.getSender().getEmail().equals(emailUser)){
            throw new RuntimeException("Vous ne pouvez supprimer que vos propres messages");
        }
        message.setEstSupprime(true);
        messageRepository.save(message);
    }


}
