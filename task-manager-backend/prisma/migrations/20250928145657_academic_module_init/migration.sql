/*
  Warnings:

  - You are about to drop the column `authorId` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - Added the required column `courseId` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."ItemType" AS ENUM ('ASSIGNMENT', 'QUIZ', 'MIDTERM', 'FINAL_EXAM', 'LAB', 'PROJECT');

-- CreateEnum
CREATE TYPE "public"."ResourceType" AS ENUM ('LINK', 'NOTE', 'FILE');

-- CreateEnum
CREATE TYPE "public"."Day" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- DropForeignKey
ALTER TABLE "public"."Task" DROP CONSTRAINT "Task_authorId_fkey";

-- AlterTable
ALTER TABLE "public"."Task" DROP COLUMN "authorId",
DROP COLUMN "createdAt",
ADD COLUMN     "courseId" INTEGER NOT NULL,
ADD COLUMN     "dueDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "createdAt",
DROP COLUMN "role";

-- DropEnum
DROP TYPE "public"."Role";

-- CreateTable
CREATE TABLE "public"."Course" (
    "id" SERIAL NOT NULL,
    "courseCode" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "instructor" TEXT,
    "credits" DOUBLE PRECISION,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."GradableItem" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "type" "public"."ItemType" NOT NULL DEFAULT 'ASSIGNMENT',
    "dueDate" TIMESTAMP(3) NOT NULL,
    "weightage" DOUBLE PRECISION NOT NULL,
    "gradeAchieved" DOUBLE PRECISION,
    "courseId" INTEGER NOT NULL,

    CONSTRAINT "GradableItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Resource" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "type" "public"."ResourceType" NOT NULL DEFAULT 'LINK',
    "content" TEXT NOT NULL,
    "courseId" INTEGER NOT NULL,

    CONSTRAINT "Resource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Schedule" (
    "id" SERIAL NOT NULL,
    "dayOfWeek" "public"."Day" NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "location" TEXT,
    "courseId" INTEGER NOT NULL,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Course" ADD CONSTRAINT "Course_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Task" ADD CONSTRAINT "Task_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GradableItem" ADD CONSTRAINT "GradableItem_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Resource" ADD CONSTRAINT "Resource_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Schedule" ADD CONSTRAINT "Schedule_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "public"."Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
