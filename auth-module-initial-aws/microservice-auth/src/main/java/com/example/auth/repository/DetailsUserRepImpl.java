package com.example.auth.repository;

import com.example.auth.model.EntityUser;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

@Repository
public class DetailsUserRepImpl implements DetailsUserRep {
    @PersistenceContext
    EntityManager entityManager;

    @Override
    public EntityUser UserDetailsWithName(String name) {
        String query = "select u from EntityUser u where u.username = :name";
        try{
            return entityManager.createQuery(query, EntityUser.class)
                    .setParameter("name", name)
                    .getSingleResult();
        }catch (NoResultException e){
            return null;
        }

    }
}
