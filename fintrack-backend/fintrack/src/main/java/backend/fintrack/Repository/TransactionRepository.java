package backend.fintrack.Repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import backend.fintrack.Model.Transaction;
import backend.fintrack.Model.Type;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByUserIdAndDateBetween(Long userId, LocalDate startDate, LocalDate endDate);

    List<Transaction> findByDateBetween(LocalDate startDate, LocalDate endDate);

    List<Transaction> findByType(Type type);

    List<Transaction> findByCategory(String category);

    List<Transaction> findByDateBetweenAndType(LocalDate startDate, LocalDate endDate, Type type);

    List<Transaction> findByDateBetweenAndCategory(LocalDate startDate, LocalDate endDate, String category);

    List<Transaction> findByDateBetweenAndTypeAndCategory(LocalDate startDate, LocalDate endDate, Type type,
            String category);

    @Query("SELECT t.type, SUM(t.amount) FROM Transaction t WHERE t.user.id = :userId AND t.date BETWEEN :startDate AND :endDate GROUP BY t.type")
    List<Object[]> getSummaryByUserIdAndDateBetween(@Param("userId") Long userId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    List<Transaction> findByUserId(Long userId);
}
