package chap05;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.io.File;
import java.io.IOException;

import static org.junit.jupiter.api.Assertions.assertTrue;

/** 일부러 스태틱 변수를 인스턴스간 참조하게 만들어서 순서가 항상 맞는지 보기
 *
 */
@DisplayName("@DisplayName, 메서드 간 독립성 확보 학습")
public class BadTest {
    private StringBuilder strBuilder = new StringBuilder();
    private static String str;

    /** @BeforeEach 가 아니라 @Test면 실패한다. 독립적으로 테스트 메서드 작성하라.
     *
     */
    @BeforeEach
    void stringBuildingTest(){
        String buildString = strBuilder.buildString("hello");
        assertTrue(buildString.length() > 0);
        this.str = buildString;
    }

    @DisplayName("String의 실제 값이 0보다 큰지 확인하는 메서드")
    @Test
    void stringBuildingTest2(){
        int data = this.str.length();
        assertTrue(data > 0);
    }
}
