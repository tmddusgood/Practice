package chap06;

import org.junit.jupiter.api.Test;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

public class MathUtilsTest {
    @Test
    void dataFileSumTest() {
        File dataFile = new File("src/test/resources/datafile.txt");
        long sum = MathUtils.sum(dataFile);
        assertEquals(10L, sum);
    }
}
