package com.ingecys.intranet_v2.Security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtProvider jwtProvider;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        return path.startsWith("/api/auth/") || path.startsWith("/api/test/");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");
        System.out.println(" URI     : " + request.getRequestURI());
        System.out.println(" HEADER  : " + authHeader);

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            System.out.println("TOKEN   : " + token.substring(0, 20) );

            try {
                boolean valid = jwtProvider.validerToken(token);
                System.out.println("VALIDE  : " + valid);

                if (valid) {
                    String email = jwtProvider.extraireEmail(token);
                    String role  = jwtProvider.extraireRole(token);


                    var auth = new UsernamePasswordAuthenticationToken(
                            email, null,
                            List.of(new SimpleGrantedAuthority("ROLE_" + role))//role oupermission
                    );
                    SecurityContextHolder.getContext().setAuthentication(auth); //stock info de decurite de requet en cour
                    System.out.println("Auth OK  : " + email);
                } else {
                    System.out.println(" Token invalide");
                }

            } catch (Exception e) {

                System.out.println(" ERREUR   : " + e.getClass().getSimpleName());
                System.out.println(" MESSAGE  : " + e.getMessage());
                e.printStackTrace();
            }

        } else {
            System.out.println("Pas de header Bearer");
        }

        filterChain.doFilter(request, response);
    }
}