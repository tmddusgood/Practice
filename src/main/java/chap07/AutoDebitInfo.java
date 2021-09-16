package chap07;

import java.time.LocalDateTime;

public class AutoDebitInfo {
    private String userId;
    private String cardNumber;
    private LocalDateTime registTime;
    private LocalDateTime updateTime;

    public AutoDebitInfo(String userId, String cardNumber, LocalDateTime registTime) {
        this.userId = userId;
        this.cardNumber = cardNumber;
        this.registTime = registTime;
        this.updateTime = registTime;
    }
}
