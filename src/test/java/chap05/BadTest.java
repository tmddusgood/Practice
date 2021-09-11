package chap05;

import org.junit.jupiter.api.Test;

import java.io.File;
import java.io.IOException;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class BadTest {
    private StringBuilder strBuilder = new StringBuilder();
    private static String str;

    @Test
    void fileCreateionTest() throws IOException{
        String buildString = strBuilder.buildString();
        assertTrue(buildString.length() > 0);
        this.str = buildString;
    }
}
