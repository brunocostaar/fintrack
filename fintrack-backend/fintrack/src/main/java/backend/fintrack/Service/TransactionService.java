package backend.fintrack.Service;

import java.time.LocalDate;
import java.util.List;

import java.math.BigDecimal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import backend.fintrack.Model.Transaction;
import backend.fintrack.Model.Type;
import backend.fintrack.Repository.TransactionRepository;
import backend.fintrack.DTO.TransactionSummary;

@Service
public class TransactionService {
    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private backend.fintrack.Repository.UserRepository userRepository;

    private backend.fintrack.Model.User getUser(String email) {
        return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("E-mail não autenticado"));
    }

    public List<Transaction> getAllTransactions(String email, Integer month, Integer year) {
        backend.fintrack.Model.User user = getUser(email);
        if (month != null && year != null) {
            LocalDate startDate = LocalDate.of(year, month, 1);
            LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());
            return transactionRepository.findByUserIdAndDateBetween(user.getId(), startDate, endDate);
        }
        return transactionRepository.findByUserId(user.getId());
    }

    public Transaction getTransactionById(Long id) {
        return transactionRepository.findById(id).orElse(null);
    }

    public Transaction createTransaction(String email, Transaction transaction) {
        transaction.setUser(getUser(email));
        return transactionRepository.save(transaction);
    }

    public Transaction updateTransaction(Long id, Transaction transaction) {
        Transaction existingTransaction = transactionRepository.findById(id).orElse(null);
        if (existingTransaction == null) {
            return null;
        }
        existingTransaction.setDescription(transaction.getDescription());
        existingTransaction.setAmount(transaction.getAmount());
        existingTransaction.setDate(transaction.getDate());
        existingTransaction.setType(transaction.getType());
        existingTransaction.setCategory(transaction.getCategory());
        return transactionRepository.save(existingTransaction);
    }

    public void deleteTransaction(String email, Long id) {
        Transaction tx = transactionRepository.findById(id).orElse(null);
        if (tx != null && tx.getUser().getId().equals(getUser(email).getId())) {
            transactionRepository.deleteById(id);
        }
    }

    public List<Transaction> getTransactionsByDateBetween(LocalDate startDate, LocalDate endDate) {
        return transactionRepository.findByDateBetween(startDate, endDate);
    }

    public List<Transaction> getTransactionsByType(Type type) {
        return transactionRepository.findByType(type);
    }

    public List<Transaction> getTransactionsByCategory(String category) {
        return transactionRepository.findByCategory(category);
    }

    public List<Transaction> getTransactionsByDateBetweenAndType(LocalDate startDate, LocalDate endDate, Type type) {
        return transactionRepository.findByDateBetweenAndType(startDate, endDate, type);
    }

    public List<Transaction> getTransactionsByDateBetweenAndCategory(LocalDate startDate, LocalDate endDate,
            String category) {
        return transactionRepository.findByDateBetweenAndCategory(startDate, endDate, category);
    }

    public List<Transaction> getTransactionsByDateBetweenAndTypeAndCategory(LocalDate startDate, LocalDate endDate,
            Type type, String category) {
        return transactionRepository.findByDateBetweenAndTypeAndCategory(startDate, endDate, type, category);
    }

    public TransactionSummary getSummary(String email, Integer month, Integer year) {
        backend.fintrack.Model.User user = getUser(email);
        LocalDate startDate;
        LocalDate endDate;
        
        if (month != null && year != null) {
            startDate = LocalDate.of(year, month, 1);
            endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());
        } else {
            startDate = LocalDate.now().withDayOfMonth(1);
            endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());
        }

        List<Object[]> results = transactionRepository.getSummaryByUserIdAndDateBetween(user.getId(), startDate, endDate);
        BigDecimal income = BigDecimal.ZERO;
        BigDecimal expense = BigDecimal.ZERO;

        for (Object[] result : results) {
            Type resultType = (Type) result[0];
            BigDecimal sum = (BigDecimal) result[1];
            
            if (resultType == Type.INCOME) {
                income = sum;
            } else if (resultType == Type.EXPENSE) {
                expense = sum;
            }
        }
        
        return new TransactionSummary(income, expense);
    }
}
