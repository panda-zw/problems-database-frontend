import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ProblemSolution {
  problem_name: string
  problem_description: string
  sector: string
  affected_regions: string[]
  adaptation_required: string
  solution_name: string
  solution_description: string
  technology_used: string[]
  examples_in_africa: string[]
}

export function ProblemSolutionDisplay({ selectedProblem }: { selectedProblem: ProblemSolution }) {
  return (
    <div className="w-full max-w-full mx-auto">
      <CardHeader className="p-0 mb-4">
        <CardTitle className="text-xl font-bold">{selectedProblem.problem_name}</CardTitle>
        <Badge variant="secondary" className="mt-2">{selectedProblem.sector}</Badge>
      </CardHeader>
      <CardContent className="grid gap-4 p-0">
        <section className="space-y-4">
          <h3 className="font-semibold text-lg mb-2">Problem Details</h3>
          <p className="text-muted-foreground text-sm">{selectedProblem.problem_description}</p>
          <div className="mt-2 gap-2">
            <p className="font-semibold text-sm">Affected Regions </p>
            {selectedProblem.affected_regions.map((region, index) => (
              <Badge key={index} variant="outline" className="mr-1 mt-1 text-muted-foreground">
                {region}
              </Badge>
            ))}
          </div>
          <div className="mt-2 text-sm">
            <p className="font-semibold">Adaptation Required </p>
            <span className="text-muted-foreground">{selectedProblem.adaptation_required}</span>
          </div>
        </section>

        <section className="grid gap-2">
          <h3 className="font-semibold text-lg mb-2">Solution</h3>
          <p className="text-sm font-semibold">{selectedProblem.solution_name}</p>
          <p className="text-muted-foreground text-sm">{selectedProblem.solution_description}</p>
          <div className="mt-2 gap-2">
            <p className="font-semibold text-sm">Technology Used: </p>
            {selectedProblem.technology_used.map((tech, index) => (
              <Badge key={index} variant="secondary" className="mr-1 mt-1 text-muted-foreground">
                {tech}
              </Badge>
            ))}
          </div>
        </section>

        <section className="grid gap-2">
          <h3 className="font-semibold text-sm mb-2">Examples in Africa</h3>
          <ul className="list-disc list-inside text-muted-foreground text-sm">
            {selectedProblem.examples_in_africa.map((example, index) => (
              <li key={index}>{example}</li>
            ))}
          </ul>
        </section>
      </CardContent>
    </div>
  )
}

