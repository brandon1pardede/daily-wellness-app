"use client";

import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { PlusIcon } from "lucide-react";
import { CheckIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { ModeToggle } from "@/components/mode-toggle";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface Activity {
  id: number;
  day: string;
  title: string;
  description: string;
  image: string;
  category: string;
  duration: string;
  difficulty: string;
  equipment: string[];
  benefits?: string[];
  best_time_of_day?: string;
  calories?: string;
  dietary_info?: string[];
  meal_prep?: boolean;
  prompts?: string[];
  calories_burn?: string;
  intervals?: string[];
  exercises?: string[];
  focus_areas?: string[];
}

export default function Home() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [selectedDay, setSelectedDay] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Activity | null>(null);

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch(
          `/api?day=${selectedDay}&category=${selectedCategory}`
        );
        const data = await response.json();
        setActivities(data);
        setIsLoaded(true);
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    };

    fetchActivities();

    const saved = localStorage.getItem("selectedCards");
    if (saved) {
      setSelectedCards(JSON.parse(saved));
    }
  }, [selectedDay, selectedCategory]);

  const toggleCard = (cardId: number) => {
    const newSelected = selectedCards.includes(cardId)
      ? selectedCards.filter((id) => id !== cardId)
      : [...selectedCards, cardId];

    setSelectedCards(newSelected);
    localStorage.setItem("selectedCards", JSON.stringify(newSelected));
  };

  // Group activities by day
  const groupedActivities = activities.reduce((acc, activity) => {
    if (!acc[activity.day]) {
      acc[activity.day] = [];
    }
    acc[activity.day].push(activity);
    return acc;
  }, {} as Record<string, Activity[]>);

  const filteredData = Object.entries(groupedActivities);

  if (!isLoaded) {
    return null;
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      Fitness: "from-violet-600 via-fuchsia-600 to-pink-600",
      Wellness: "from-emerald-600 via-teal-500 to-cyan-600",
      Nutrition: "from-orange-600 via-amber-500 to-yellow-500",
      Mindfulness: "from-blue-600 via-indigo-600 to-violet-700",
    };
    return (
      colors[category as keyof typeof colors] ||
      "from-slate-600 via-gray-500 to-zinc-600"
    );
  };

  return (
    <div className="min-h-screen p-4 sm:p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto">
        {/* Header with Mode Toggle */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-end mb-6 sm:mb-8"
        >
          <ModeToggle />
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8 flex flex-col sm:flex-row gap-3 sm:gap-4"
        >
          <Select value={selectedDay} onValueChange={setSelectedDay}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select day" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All days</SelectItem>
              {days.map((day) => (
                <SelectItem key={day} value={day}>
                  {day}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              <SelectItem value="Fitness">Fitness</SelectItem>
              <SelectItem value="Wellness">Wellness</SelectItem>
              <SelectItem value="Nutrition">Nutrition</SelectItem>
              <SelectItem value="Mindfulness">Mindfulness</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Cards Grid */}
        <div className="space-y-6 sm:space-y-8">
          <AnimatePresence>
            {filteredData.map(([day, cards]) => (
              <motion.section
                key={day}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-800 dark:text-gray-100">
                  {day}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {cards.map((card) => (
                    <motion.div
                      key={card.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                      className="h-full"
                    >
                      <Card
                        className={`
                          group relative overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer h-full flex flex-col
                          ${
                            selectedCards.includes(card.id)
                              ? "ring-2 ring-offset-2 ring-blue-500"
                              : ""
                          }
                        `}
                        onClick={() => setSelectedCard(card)}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br opacity-10 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none">
                          <div
                            className={`w-full h-full bg-gradient-to-br ${getCategoryColor(
                              card.category
                            )}`}
                          />
                        </div>
                        <CardHeader className="p-0">
                          <div className="relative h-40 sm:h-48 overflow-hidden">
                            <Image
                              src={card.image}
                              alt={card.title}
                              width={400}
                              height={300}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute top-2 right-2">
                              <span
                                className={`
                                px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium
                                bg-gradient-to-r ${getCategoryColor(
                                  card.category
                                )} 
                                text-white shadow-lg
                              `}
                              >
                                {card.category}
                              </span>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="p-3 sm:p-4 flex-grow">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-bold text-base sm:text-lg text-gray-800 dark:text-gray-100">
                              {card.title}
                            </h3>
                            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                              {card.duration}
                            </span>
                          </div>
                          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-3 line-clamp-3 sm:line-clamp-4">
                            {card.description}
                          </p>
                          <div className="space-y-2">
                            <div className="flex items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                              <span className="font-medium mr-2">
                                Difficulty:
                              </span>
                              {card.difficulty}
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {card.equipment.map((item, index) => (
                                <span
                                  key={index}
                                  className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded"
                                >
                                  {item}
                                </span>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="p-3 sm:p-4 pt-0">
                          <Button
                            variant={
                              selectedCards.includes(card.id)
                                ? "default"
                                : "outline"
                            }
                            size="icon"
                            className={`
                              ml-auto transition-all duration-300
                              ${
                                selectedCards.includes(card.id)
                                  ? "bg-gradient-to-r " +
                                    getCategoryColor(card.category)
                                  : ""
                              }
                            `}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleCard(card.id);
                            }}
                          >
                            {selectedCards.includes(card.id) ? (
                              <CheckIcon className="h-4 w-4" />
                            ) : (
                              <PlusIcon className="h-4 w-4" />
                            )}
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <Dialog open={!!selectedCard} onOpenChange={() => setSelectedCard(null)}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {selectedCard && (
              <div className="space-y-4">
                <div className="relative h-[200px] sm:h-[300px] w-full overflow-hidden rounded-t-lg">
                  <Image
                    src={selectedCard.image}
                    alt={selectedCard.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <span
                      className={`
                        px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium
                        bg-gradient-to-r ${getCategoryColor(
                          selectedCard.category
                        )} 
                        text-white shadow-lg
                      `}
                    >
                      {selectedCard.category}
                    </span>
                  </div>
                </div>

                <div className="p-3 sm:p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl sm:text-2xl font-bold">
                      {selectedCard.title}
                    </h2>
                    <span className="text-xs sm:text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                      {selectedCard.duration}
                    </span>
                  </div>

                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-6">
                    {selectedCard.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold mb-2 text-sm sm:text-base">
                        Equipment Needed:
                      </h3>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {selectedCard.equipment.map(
                          (item: string, i: number) => (
                            <li key={i}>{item}</li>
                          )
                        )}
                      </ul>
                    </div>

                    {selectedCard.benefits && (
                      <div>
                        <h3 className="font-semibold mb-2 text-sm sm:text-base">
                          Benefits:
                        </h3>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          {selectedCard.benefits.map(
                            (benefit: string, i: number) => (
                              <li key={i}>{benefit}</li>
                            )
                          )}
                        </ul>
                      </div>
                    )}
                  </div>

                  {selectedCard.best_time_of_day && (
                    <div className="mt-4 text-sm sm:text-base">
                      <span className="font-semibold">Best Time: </span>
                      {selectedCard.best_time_of_day}
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
