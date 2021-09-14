package chap05;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledOnJre;
import org.junit.jupiter.api.condition.EnabledOnOs;
import org.junit.jupiter.api.condition.JRE;
import org.junit.jupiter.api.condition.OS;

import java.time.LocalDate;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class EnabledOnTest {
    @Test
    @EnabledOnOs(OS.WINDOWS)
    void testOnWindows() {
        assertEquals(2, 1 + 1);
    }

}
