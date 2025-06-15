"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/icons";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";

export default function Home() {
  const [questions, setQuestions] = useState<any[]>([]); // Store all questions
  const [currentIndex, setCurrentIndex] = useState(0); // Track the current question index
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    const fetchAllQuestions = async () => {
      const querySnapshot = await getDocs(collection(db, "daily-devops-quiz"));
      const allQuestions = querySnapshot.docs
        .map((doc) => doc.data())
        .filter((question) => new Date(question.date) <= new Date()) // Filter questions up to today's date
        .sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        ); // Sort by date
      setQuestions(allQuestions);
      setCurrentIndex(allQuestions.length - 1); // Set the current index to the last question
    };

    fetchAllQuestions();
  }, []);

  const formatDateToPlainEnglish = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();

    // Add suffix for the day (e.g. 1st, 2nd, 3rd)
    const daySuffix =
      day % 10 === 1 && day !== 11
        ? "st"
        : day % 10 === 2 && day !== 12
          ? "nd"
          : day % 10 === 3 && day !== 13
            ? "rd"
            : "th";

    return `${day}${daySuffix} ${month}, ${year}`;
  };

  const navigateDate = (direction: "left" | "right") => {
    if (direction === "left" && currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    } else if (direction === "right" && currentIndex < questions.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
    setSelectedAnswer(""); // Reset selected answer when navigating
  };

  const handleAnswerClick = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const currentQuestion = questions[currentIndex] || {};

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-xl text-center justify-center">
        <span className="text-3xl font-bold">Daily&nbsp;</span>
        <span className="text-3xl font-bold text-violet-500">DevOps</span>
        <br />
      </div>
      <Card className="w-full max-w-[90%] md:max-w-[340px]">
        <CardHeader className="flex gap-4 items-center justify-center">
          <Button
            isIconOnly
            isDisabled={currentIndex === 0} // Disable if at the first question
            onPress={() => navigateDate("left")}
          >
            <ArrowLeftIcon />
          </Button>
          <h4>
            {currentQuestion.date === new Date().toISOString().split("T")[0]
              ? "Today"
              : formatDateToPlainEnglish(currentQuestion.date)}
          </h4>
          <Button
            isIconOnly
            isDisabled={currentIndex === questions.length - 1} // Disable if at the last question
            onPress={() => navigateDate("right")}
          >
            <ArrowRightIcon />
          </Button>
        </CardHeader>
        <Divider />
        <CardBody className="overflow-visible">
          <p className="py-2 text-center">{currentQuestion.question}</p>
          <Divider />
          <div className="flex py-4 flex-col gap-4 items-left">
            {currentQuestion.choices?.map((answer: string, index: number) => (
              <Button
                key={index}
                color={
                  selectedAnswer === answer
                    ? answer === currentQuestion.correctAnswer
                      ? "success"
                      : "danger"
                    : "default"
                }
                onPress={() => handleAnswerClick(answer)}
              >
                {answer}
              </Button>
            ))}
          </div>
        </CardBody>
      </Card>

      <Button
        color="primary"
        onPress={onOpen}
        style={{
          display:
            selectedAnswer === currentQuestion.correctAnswer &&
            selectedAnswer !== ""
              ? "block"
              : "none",
        }}
      >
        Explanation
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {currentQuestion.correctAnswer}
              </ModalHeader>
              <ModalBody>
                <p>{currentQuestion.moreReading}</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </section>
  );
}
