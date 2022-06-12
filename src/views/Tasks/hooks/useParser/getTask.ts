import {
  ComplexTaskType,
  isComplexTaskType,
  KillSomeTask,
  QuestSomeTask,
  Task,
  TaskType,
  WorshipTask,
} from "../../store"
import { getType } from "./getType"

const complexTaskToParserMap: Record<ComplexTaskType, (el: HTMLElement) => Task> = {
  [TaskType.WORSHIP]: getWorshipTask,
  [TaskType.QUEST_SOME]: getQuestSomeTask,
  [TaskType.KILL_SOME]: getKillSomeTask,
}

export function getTask(el: HTMLElement): Task {
  const type = getType(el)
  if (isComplexTaskType(type)) return complexTaskToParserMap[type](el)

  const [progress, requirement] = getProgress(el)
  const [title, icon] = getMeta(el)

  return {
    type,
    title,
    icon,
    progress,
    requirement,
  }
}

function getMeta(el: HTMLElement): [string, string] {
  const textElement = el.children[0] as HTMLDivElement
  const title = textElement.innerText

  const imgElement = textElement.children[0] as HTMLImageElement
  const icon = imgElement.getAttribute("src") || ""

  return [title, icon]
}

function getProgress(el: HTMLElement): [number, number] {
  const progressElement = el.children[1] as HTMLElement
  const isCompleted = !!progressElement.querySelector("svg")
  if (isCompleted) return [1, 1]

  return (progressElement.innerText.split(" / ").map((e) => Number(e)) as [number, number]) ?? [0, 0]
}

function getText(el: HTMLElement): string {
  return el.querySelector<HTMLSpanElement>("span.truncate")?.innerText ?? ""
}

function getCardText(el: HTMLElement): string {
  const onclickData = el.getAttribute("onclick")
  if (!onclickData) return "No meta found"

  return (
    onclickData
      .slice(onclickData.indexOf("('"))
      .replace(/[)("']/g, "")
      .split(",")
      .map((e) => e.trim())[1] ?? ""
  )
}

function getKillSomeTask(el: HTMLElement): KillSomeTask {
  const [progress, requirement] = getProgress(el)
  const [title, icon] = getMeta(el)

  const text = getText(el)
  const target = text.match(/(?<=Kill )(.*)(?= [0-9])/g)?.[0] ?? "UNKNOWN TARGET"

  const cardText = getCardText(el)
  const location = cardText.slice(cardText.indexOf("found in ") + "found in ".length, -1)

  return {
    type: TaskType.KILL_SOME,
    title,
    icon,
    progress,
    requirement,
    target,
    location,
  }
}

function getQuestSomeTask(el: HTMLElement): QuestSomeTask {
  const [progress, requirement] = getProgress(el)
  const [title, icon] = getMeta(el)

  const text = getText(el)
  const target = text.match(/(?<=Complete quest )(.*)(?= [0-9])/g)?.[0] ?? "UNKNOWN TARGET"

  return {
    type: TaskType.QUEST_SOME,
    title,
    icon,
    progress,
    requirement,
    target,
  }
}

function getWorshipTask(el: HTMLElement): WorshipTask {
  const [progress, requirement] = getProgress(el)
  const [title, icon] = getMeta(el)

  const text = getText(el)
  const target = text.split(" ")[1] ?? ""

  return {
    type: TaskType.WORSHIP,
    title,
    icon,
    progress,
    requirement,
    target,
  }
}