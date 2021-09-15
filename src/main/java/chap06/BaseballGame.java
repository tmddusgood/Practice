package chap06;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class BaseballGame {
    private List<String> setNumStrArray;
    private int strikes = 0;
    private int balls = 0;

    public BaseballGame(String nums) {
        setNumStrArray = Arrays.asList(nums.split(""));
    }

    public Score guess(String nums){
        countStrike(nums.split(""));
        return new Score(strikes, balls);
    }

    public void countStrike(String[] givenNumStrArray){
        for (String givenEach : givenNumStrArray){
            if(setNumStrArray.contains(givenEach)) strikes ++;
            else balls ++;
        }
    }
}
