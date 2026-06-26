/*
  Warnings:

  - You are about to drop the `Exercise` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Muscle` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TrainingPlan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TrainingPlanExercise` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Workout` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WorkoutExercise` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WorkoutSet` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Exercise" DROP CONSTRAINT "Exercise_muscleId_fkey";

-- DropForeignKey
ALTER TABLE "Exercise" DROP CONSTRAINT "Exercise_userId_fkey";

-- DropForeignKey
ALTER TABLE "TrainingPlanExercise" DROP CONSTRAINT "TrainingPlanExercise_exerciseId_fkey";

-- DropForeignKey
ALTER TABLE "TrainingPlanExercise" DROP CONSTRAINT "TrainingPlanExercise_planId_fkey";

-- DropForeignKey
ALTER TABLE "Workout" DROP CONSTRAINT "Workout_userId_fkey";

-- DropForeignKey
ALTER TABLE "WorkoutExercise" DROP CONSTRAINT "WorkoutExercise_exerciseId_fkey";

-- DropForeignKey
ALTER TABLE "WorkoutExercise" DROP CONSTRAINT "WorkoutExercise_workoutId_fkey";

-- DropForeignKey
ALTER TABLE "WorkoutSet" DROP CONSTRAINT "WorkoutSet_exerciseId_fkey";

-- DropTable
DROP TABLE "Exercise";

-- DropTable
DROP TABLE "Muscle";

-- DropTable
DROP TABLE "TrainingPlan";

-- DropTable
DROP TABLE "TrainingPlanExercise";

-- DropTable
DROP TABLE "Workout";

-- DropTable
DROP TABLE "WorkoutExercise";

-- DropTable
DROP TABLE "WorkoutSet";

-- CreateTable
CREATE TABLE "workouts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT,
    "startTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" TIMESTAMP(3),
    "notes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workouts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workout_exercises" (
    "id" TEXT NOT NULL,
    "workoutId" TEXT NOT NULL,
    "exerciseId" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "workout_exercises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exercise_sets" (
    "id" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "setNumber" INTEGER NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "reps" INTEGER NOT NULL,
    "breakTime" INTEGER NOT NULL,
    "notes" TEXT,

    CONSTRAINT "exercise_sets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exercises" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "name" TEXT NOT NULL,
    "muscleId" TEXT NOT NULL,

    CONSTRAINT "exercises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trainingplans" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL DEFAULT '',
    "name" TEXT NOT NULL,

    CONSTRAINT "trainingplans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trainingplan_exercises" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "sets" INTEGER,

    CONSTRAINT "trainingplan_exercises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "muscles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "muscles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "muscles_name_key" ON "muscles"("name");

-- AddForeignKey
ALTER TABLE "workouts" ADD CONSTRAINT "workouts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_exercises" ADD CONSTRAINT "workout_exercises_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "workouts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workout_exercises" ADD CONSTRAINT "workout_exercises_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "exercises"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercise_sets" ADD CONSTRAINT "exercise_sets_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "workout_exercises"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercises" ADD CONSTRAINT "exercises_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercises" ADD CONSTRAINT "exercises_muscleId_fkey" FOREIGN KEY ("muscleId") REFERENCES "muscles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trainingplan_exercises" ADD CONSTRAINT "trainingplan_exercises_planId_fkey" FOREIGN KEY ("planId") REFERENCES "trainingplans"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trainingplan_exercises" ADD CONSTRAINT "trainingplan_exercises_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "exercises"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
