package com.autoskola.demo.exception;

public class AlreadyLoggedInException extends RuntimeException {
    public AlreadyLoggedInException() {
        super("User is already logged in for the current session!");
    }
}
