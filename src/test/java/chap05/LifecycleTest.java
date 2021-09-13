package chap05;

import org.junit.jupiter.api.*;

import javax.swing.*;
import javax.swing.plaf.basic.BasicInternalFrameTitlePane;

public class LifecycleTest {
    /** 실행 순서를 알아보는 테스트
     * 1. 테스트 메서드를 포함한(정확히는 @Test 애노테이션이 붙은) 객체 생성
     * 2. (존재하면) @BeforeEach 애노테이션이 붙은 메서드 실행
     * 3. @Test 애노테이션이 붙은 메서드 실행
     * 4. (존재하면0 @AfterEach 애노테이션이 붙은 메서드 실행
     */

    public LifecycleTest() {
        System.out.println("new LifecycleTest");
    }

    @BeforeAll
    static void testSetUp() {
        System.out.println("setUp all test");
    }

    @AfterEach
    void tearDown(){
        System.out.println("tearDown");
    }

    @BeforeEach
    void setUp(){
    System.out.println("setUp");
    }

    @Test
    void a(){
        System.out.println('A');
    }

    @Test
    void b(){
        System.out.println("B");
    }

    @AfterAll
    static void testTearDown() {
        System.out.println("after all test");
    }
}