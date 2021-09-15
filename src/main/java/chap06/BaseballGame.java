package chap06;

import java.util.Arrays;

public class BaseballGame {
    private String[] setNumStrArray = {};
    private int strikes = 0;
    private int balls = 0;

    public BaseballGame(String nums) {
        setNumStrArray = nums.split("");
    }

    public Score guess(String nums){
        countStrike(nums.split(""));
        return new Score(strikes, balls);
    }

    public void countStrike(String[] givenNumStrArray){
        for (String givenEach : givenNumStrArray){
            if(Arrays.stream(setNumStrArray).anyMatch(setEach -> setEach.equals(givenEach))) strikes ++;
            else balls ++;
        }
    }
}
