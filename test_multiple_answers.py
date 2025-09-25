#!/usr/bin/env python3
"""
Test script to verify multiple answer grading logic
"""

def test_grading_logic():
    """Test the grading logic for multiple correct answers"""
    
    # Test cases
    test_cases = [
        # (user_answer, correct_answer, expected_result, description)
        ("A", "A", True, "Single correct answer - exact match"),
        ("A", "B", False, "Single correct answer - wrong choice"),
        ("ACE", "ACE", True, "Multiple correct answers - exact match"),
        ("AEC", "ACE", True, "Multiple correct answers - different order"),
        ("AC", "ACE", False, "Multiple correct answers - missing choice"),
        ("ACEF", "ACE", False, "Multiple correct answers - extra choice"),
        ("", "ACE", False, "Multiple correct answers - no answer"),
        ("AB", "AB", True, "Two correct answers - exact match"),
        ("BA", "AB", True, "Two correct answers - different order"),
        ("A", "AB", False, "Two correct answers - missing choice"),
        ("ABC", "AB", False, "Two correct answers - extra choice"),
    ]
    
    print("Testing multiple answer grading logic...")
    print("=" * 60)
    
    for user_answer, correct_answer, expected, description in test_cases:
        # Apply the same logic as in the backend
        if len(correct_answer) > 1:
            # For multiple correct answers, check if user's answer contains all correct letters
            user_letters = set(user_answer.upper())
            correct_letters = set(correct_answer.upper())
            result = user_letters == correct_letters
        else:
            # Single correct answer
            result = user_answer.upper() == correct_answer.upper()
        
        status = "✅ PASS" if result == expected else "❌ FAIL"
        print(f"{status} | {description}")
        print(f"     User: '{user_answer}' | Correct: '{correct_answer}' | Result: {result} | Expected: {expected}")
        print()
    
    print("=" * 60)
    print("Test completed!")

if __name__ == "__main__":
    test_grading_logic()
