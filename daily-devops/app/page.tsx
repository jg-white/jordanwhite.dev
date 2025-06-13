"use client";

import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/icons";

export default function Home() {
  const [questionData, setQuestionData] = useState({
    date: "",
    question: "",
    answers: [],
    correctAnswer: "",
  });
  const [canNavigateLeft, setCanNavigateLeft] = useState(false);
  const [canNavigateRight, setCanNavigateRight] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState("");

  const checkNavigationAvailability = async (date: string) => {
    const leftQuery = query(
      collection(db, "daily-devops"),
      where("date", "<", date),
      orderBy("date", "desc"),
      limit(1)
    );
    const leftSnapshot = await getDocs(leftQuery);
    setCanNavigateLeft(!leftSnapshot.empty);

    const rightQuery = query(
      collection(db, "daily-devops"),
      where("date", ">", date),
      orderBy("date", "asc"),
      limit(1)
    );
    const rightSnapshot = await getDocs(rightQuery);
    setCanNavigateRight(!rightSnapshot.empty);
  };

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD

    const fetchQuestion = async (date: string) => {
      const q = query(
        collection(db, "daily-devops"),
        where("date", "==", date)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setQuestionData({
          date: doc.data().date || "",
          question: doc.data().question || "",
          answers: doc.data().answers || [],
          correctAnswer: doc.data().correctAnswer || "",
        });
      });
    };

    fetchQuestion(today);
    checkNavigationAvailability(today);
  }, []);

  const navigateDate = async (direction: "left" | "right") => {
    const currentDate = questionData.date;
    const queryDirection = direction === "left" ? "<" : ">";
    const orderDirection = direction === "left" ? "desc" : "asc";

    const q = query(
      collection(db, "daily-devops"),
      where("date", queryDirection, currentDate),
      orderBy("date", orderDirection),
      limit(1)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const newDate = doc.data().date || "";
      setQuestionData({
        date: newDate,
        question: doc.data().question || "",
        answers: doc.data().answers || [],
        correctAnswer: doc.data().correctAnswer || "",
      });

      // Pass the new date directly to checkNavigationAvailability
      checkNavigationAvailability(newDate);
    });

    setSelectedAnswer(""); // Reset selected answer when navigating
  };

  const handleAnswerClick = (answer: string) => {
    setSelectedAnswer(answer);
  };

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-xl text-center justify-center">
        <span className="text-3xl font-bold">Daily&nbsp;</span>
        <span className="text-3xl font-bold text-violet-500">DevOps&nbsp;</span>
        <br />
      </div>
      <Card className="w-full max-w-[90%] md:max-w-[340px]">
        <CardHeader className="flex gap-4 items-center justify-center">
          <Button
            isIconOnly
            isDisabled={!canNavigateLeft}
            onPress={() => navigateDate("left")}
          >
            <ArrowLeftIcon />
          </Button>
          <h4>{questionData.date}</h4>
          <Button
            isIconOnly
            isDisabled={!canNavigateRight}
            onPress={() => navigateDate("right")}
          >
            <ArrowRightIcon />
          </Button>
        </CardHeader>
        <Divider />
        <CardBody className="overflow-visible">
          <p className="py-2 text-center">{questionData.question}</p>
          <Divider />
          <div className="flex py-4 flex-col gap-4 items-left">
            {questionData.answers.map((answer, index) => (
              <Button
                key={index}
                color={
                  selectedAnswer === answer
                    ? answer === questionData.correctAnswer
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
    </section>
  );
}
