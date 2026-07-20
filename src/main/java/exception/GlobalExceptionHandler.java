package exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> gererErreur(RuntimeException ex)
    {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(Map.of(
                        "erreur",ex.getMessage(),
                        "timestamp", LocalDateTime.now().toString()
                ));
    }
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> gererErreur(Exception ex)
    {
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of(
                        "erreur",ex.getMessage(),
                        "detail", ex.getMessage(),
                        "timestamp", LocalDateTime.now().toString()
                ));
    }




}
