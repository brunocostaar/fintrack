package backend.fintrack.Controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import backend.fintrack.Model.Transaction;
import backend.fintrack.Service.TransactionService;
import jakarta.validation.Valid;
import backend.fintrack.DTO.TransactionSummary;
import java.security.Principal;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @GetMapping("/transactions")
    public ResponseEntity<List<Transaction>> getAllTransactions(
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year, Principal principal) {
        return ResponseEntity.ok(transactionService.getAllTransactions(principal.getName(), month, year));
    }

    @PostMapping("/transactions")
    public ResponseEntity<Transaction> createTransaction(@RequestBody @Valid Transaction transaction, Principal principal) {
        return ResponseEntity.ok(transactionService.createTransaction(principal.getName(), transaction));
    }

    @DeleteMapping("/transactions/{id}")
    public ResponseEntity<Void> deleteTransaction(@PathVariable Long id, Principal principal) {
        transactionService.deleteTransaction(principal.getName(), id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/transactions/summary")
    public ResponseEntity<TransactionSummary> getSummary(
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year, Principal principal) {
        return ResponseEntity.ok(transactionService.getSummary(principal.getName(), month, year));
    }
}
