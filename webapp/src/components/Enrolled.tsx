import { useMutation, useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { toast } from "react-toastify";
import { axiosAPIErrorHandler } from "../lib/errors";
import axiosInstance from "../lib/http-client";
import { APIError, Student } from "../types/common";
import { Course } from "../types/courses";

type EnrolledProps = {
  course: Course;
};

function Enrolled(props: EnrolledProps) {
  const emailInputRef = useRef<HTMLInputElement>(null);
  const query = useQuery({
    queryKey: ["enrolledStudents", props.course.id],
    queryFn: async () => {
      try {
        return (
          await axiosInstance.get<Student[]>(
            `/courses/${props.course.id}/enrolled`
          )
        ).data;
      } catch (error) {
        axiosAPIErrorHandler(error);
      }
    },
  });

  const enrollStudentMutation = useMutation({
    mutationKey: ["enrollStudent", props.course.id],
    mutationFn: async () => {
      try {
        const data = await (
          await axiosInstance.put(`/courses/${props.course.id}/enrolled`, {
            email: emailInputRef.current?.value,
          })
        ).data;
        return data;
      } catch (error) {
        axiosAPIErrorHandler(error);
      }
    },
    onSuccess: () => {
      query.refetch();
    },
    onError: (error: APIError) => {
      toast(error.message, { type: "error" });
    },
  });

  const handleEnrollStudent = async () => {
    const email = emailInputRef.current?.value;
    if (!email) {
      return;
    }
    enrollStudentMutation.reset();
    await enrollStudentMutation.mutateAsync();
  };

  if (!query.data) {
    return null;
  }
  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="table-zebra table">
          <thead>
            <tr>
              <th className="rounded-none capitalize">Student</th>
              <th className="rounded-none capitalize">Email</th>
            </tr>
          </thead>
          <tbody>
            {query.data.map((student) => (
              <tr key={student.id}>
                <td className="rounded-none">{student.name}</td>
                <td className="rounded-none">
                  <a
                    className="link link-primary"
                    href={`mailto:${student.email}`}
                  >
                    {student.email}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-4">
        {/* Enroll new student */}
        <input
          type="email"
          className="input input-primary rounded-none"
          placeholder="Enter student email"
          id="email"
          ref={emailInputRef}
          name="email"
        />
        <button
          className="btn btn-primary"
          onClick={handleEnrollStudent}
          disabled={enrollStudentMutation.isLoading}
        >
          Enroll
        </button>
      </div>
    </div>
  );
}

export default Enrolled;
