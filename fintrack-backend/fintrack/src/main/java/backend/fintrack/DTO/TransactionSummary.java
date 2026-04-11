package backend.fintrack.DTO;

import java.math.BigDecimal;

public class TransactionSummary {
    private BigDecimal income;
    private BigDecimal expense;
    private BigDecimal balance;

    public TransactionSummary(BigDecimal income, BigDecimal expense) {
        this.income = income != null ? income : BigDecimal.ZERO;
        this.expense = expense != null ? expense : BigDecimal.ZERO;
        this.balance = this.income.subtract(this.expense);
    }

    public BigDecimal getIncome() {
        return income;
    }

    public void setIncome(BigDecimal income) {
        this.income = income;
    }

    public BigDecimal getExpense() {
        return expense;
    }

    public void setExpense(BigDecimal expense) {
        this.expense = expense;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }
}
