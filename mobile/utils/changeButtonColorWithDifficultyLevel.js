export default function changeButtonColorWithDifficultyLevel(level) {

    switch (level) {
        case "Beginner":
          return "bg-secondary"
        case "Intermediate":
          return "bg-[#73442A]"
        case "Hard":
          return "bg-[#852221]"
        case "Extreme":
          return "bg-[#4B0404]"
      }
}