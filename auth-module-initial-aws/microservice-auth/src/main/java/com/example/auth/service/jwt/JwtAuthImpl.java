package com.example.auth.service.jwt;

import com.example.auth.model.EntityUser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import java.security.Key;
import java.util.Base64;
import java.util.Date;

@Service
@RequiredArgsConstructor
public class JwtAuthImpl implements JwtAuth {
    @Value("${jwt.secret.key}")
    private String secretKey;

    @Value("${jwt.time.expiration}")
    private String expiration;


    public String CreatedToken(EntityUser user) {
        return Jwts.builder()
                .setSubject(user.getUsername())
                .claim("roles", user.getAuthorities())
                .claim("idUser", user.getId())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis()+ Long.parseLong(expiration)))
                .signWith(getGenerateSign(), SignatureAlgorithm.HS256)
                .compact();
    }


    private Key getGenerateSign(){
        byte[] signature = Base64.getDecoder().decode(secretKey);
        return Keys.hmacShaKeyFor(signature);
    }

    public boolean ValidationToken(String token){
        try{
            Jwts.parserBuilder()
                    .setSigningKey(getGenerateSign())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            return true;
        }catch (Exception e){
            return false;
        }
    }


}
