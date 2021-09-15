package chap06;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;

public class BaseballGameTest {
    @Test
    void allMatch() {
        BaseballGame game = new BaseballGame("456");
    }


    @Test
    void exactMatch(){
        // 정답이 456인 상황
        BaseballGame game = new BaseballGame("456");
        // 실행
        Score score = game.guess("256");
        assertEquals(2, score.strikes);
    }
}
