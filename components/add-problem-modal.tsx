"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface Problem {
  _id: string; // Use _id instead of id
  problem_name: string;
  sector: string;
  problem_description: string;
  affected_regions: string[];
  solution_name: string;
  solution_description: string;
  technology_used: string[];
  adaptation_required: string;
  examples_in_africa: string[];
}

interface AddProblemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess?: () => void; // Callback for successful submission
  problemToEdit?: Problem | null; // Problem to edit
}

export default function AddProblemModal({
  isOpen,
  onClose,
  onSubmitSuccess,
  problemToEdit,
}: AddProblemModalProps) {
  const [problem, setProblem] = useState<Omit<Problem, "_id">>({
    problem_name: "",
    sector: "",
    problem_description: "",
    affected_regions: [],
    solution_name: "",
    solution_description: "",
    technology_used: [],
    adaptation_required: "",
    examples_in_africa: [],
  });

  // Update the modal state with `problemToEdit` when it changes
  useEffect(() => {
    if (problemToEdit) {
      setProblem({
        ...problemToEdit,
      });
    } else {
      setProblem({
        problem_name: "",
        sector: "",
        problem_description: "",
        affected_regions: [],
        solution_name: "",
        solution_description: "",
        technology_used: [],
        adaptation_required: "",
        examples_in_africa: [],
      });
    }
  }, [problemToEdit]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProblem((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof Problem
  ) => {
    const { value } = e.target;
    setProblem((prev) => ({
      ...prev,
      [field]: value.split(",").map((item) => item.trim()),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/problems${
          problemToEdit ? `/${problemToEdit._id}` : ""
        }`,
        {
          method: problemToEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(problem),
        }
      );

      if (response.ok) {
        toast.success(
          problemToEdit
            ? "Problem updated successfully!"
            : "Problem added successfully!"
        );
        onClose(); // Close the modal
        setProblem({
          problem_name: "",
          sector: "",
          problem_description: "",
          affected_regions: [],
          solution_name: "",
          solution_description: "",
          technology_used: [],
          adaptation_required: "",
          examples_in_africa: [],
        });
        onSubmitSuccess?.(); // Trigger callback if provided
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to save problem.");
      }
    } catch (error) {
      console.log(error)
      toast.error("An error occurred while saving the problem.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] md:max-w-5xl">
        <DialogHeader>
          <DialogTitle>
            {problemToEdit ? "Edit Problem" : "Add Problem"}
          </DialogTitle>
          <DialogDescription>
            {problemToEdit
              ? "Update the details of the problem."
              : "Enter the details of the new problem and its solution here."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="problem_name" className="text-right">
                Problem Name
              </Label>
              <Input
                id="problem_name"
                name="problem_name"
                value={problem.problem_name}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sector" className="text-right">
                Sector
              </Label>
              <Input
                id="sector"
                name="sector"
                value={problem.sector}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="problem_description" className="text-right">
                Problem Description
              </Label>
              <Textarea
                id="problem_description"
                name="problem_description"
                value={problem.problem_description}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="affected_regions" className="text-right">
                Affected Regions
              </Label>
              <div className="col-span-3">
                <Input
                  id="affected_regions"
                  name="affected_regions"
                  value={problem.affected_regions.join(", ")}
                  onChange={(e) => handleArrayChange(e, "affected_regions")}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Please enter the affected regions separated by commas.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="solution_name" className="text-right">
                Solution Name
              </Label>
              <Input
                id="solution_name"
                name="solution_name"
                value={problem.solution_name}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="solution_description" className="text-right">
                Solution Description
              </Label>
              <Textarea
                id="solution_description"
                name="solution_description"
                value={problem.solution_description}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="technology_used" className="text-right">
                Technology Used
              </Label>
              <div className="col-span-3">
                <Input
                  id="technology_used"
                  name="technology_used"
                  value={problem.technology_used.join(", ")}
                  onChange={(e) => handleArrayChange(e, "technology_used")}
                  className="col-span-3"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Please enter the technology used separated by commas.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="adaptation_required" className="text-right">
                Adaptation Required
              </Label>
              <Input
                id="adaptation_required"
                name="adaptation_required"
                value={problem.adaptation_required}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="examples_in_africa" className="text-right">
                Examples in Africa
              </Label>
              <div className="col-span-3">
                <Input
                  id="examples_in_africa"
                  name="examples_in_africa"
                  value={problem.examples_in_africa.join(", ")}
                  onChange={(e) => handleArrayChange(e, "examples_in_africa")}
                  className="col-span-3"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Please enter the examples in africa separated by commas.
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Add Problem</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
