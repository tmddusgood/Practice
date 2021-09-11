package chap05;

import org.junit.jupiter.api.Test;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

public class AuthServiceTest {

    @Test
    void assertLocalDate(){
        LocalDate dateTime1 = LocalDate.now();
        LocalDate dateTime2 = LocalDate.now();

        assertSame(dateTime1, dateTime2); // 같은 오브젝트인지 검증
        assertEquals(dateTime1, dateTime2); // 같은 값인지 검증

        // 위의 테스트 값들은 boolean 값이 아니다!
        // assertTrue(assertSame(dateTime1, dateTime2));
        // assertTrue(assertEquals(dateTime1, dateTime2));
    }

    @Test
    void assertThrowTest() {
        IllegalArgumentException thrown = assertThrows(IllegalArgumentException.class,
                () -> {
                    AuthService authService = new AuthService();
                    authService.authenticate(null, null);
                }
        );
        assertTrue(thrown.getMessage().contains("id"));
    }
}
