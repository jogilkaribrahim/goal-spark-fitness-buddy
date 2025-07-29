import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generatePDF = (data) => {
  const doc = new jsPDF();

  // Add two icons from public folder: one at the left end, one at the right end of the PDF
  // (Assume icons are: /public/gym-logo.png and /public/wolf.png)
  // jsPDF's addImage requires base64 or URL (for browser). We'll fetch and add.
  // This function works in browser context.
  const addIcons = async () => {
    // Helper to fetch image and convert to base64
    const getBase64FromUrl = async (url) => {
      const response = await fetch(url);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    };

    // Fetch both icons
    const [fitnessIcon, dietIcon] = await Promise.all([
      getBase64FromUrl("/gym-logo.png"),
      getBase64FromUrl("/wolf.png"),
    ]);

    // Get page width to position icons at left and right ends
    const pageWidth = doc.internal.pageSize.getWidth();
    // Make the icons smaller
    const iconWidth = 14;
    const iconHeight = 14;
    const margin = 10;
    // Add fitnessIcon at the left end (margin from left), with space below
    doc.addImage(fitnessIcon, "PNG", margin, 10, iconWidth, iconHeight);
    // Add dietIcon at the right end (margin from right), with space below
    doc.addImage(
      dietIcon,
      "PNG",
      pageWidth - iconWidth - margin,
      10,
      iconWidth,
      iconHeight
    );
    // Add space below the icons by moving the content start Y down
    // We'll return the Y position after the icons so the rest of the content can start lower
    return 10 + iconHeight + 6; // 6px extra space below icons
  };

  // Because addIcons is async, wrap the rest in a function
  const generateContent = (contentStartY = 0) => {
    // Cover Page
    // If contentStartY is provided (from addIcons), start content below icons
    const startY = contentStartY > 0 ? contentStartY : 14;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text("Personalized Fitness & Diet Plan", 14, startY + 21);

    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text(`Goal: ${data.plan_details.goal}`, 14, startY + 41);
    doc.text(
      `Duration: ${data.plan_details.duration_weeks} weeks`,
      14,
      startY + 49
    );
    doc.text(
      `Estimated Calories: ${data.plan_details.estimated_calories} kcal`,
      14,
      startY + 57
    );

    // Summary (shortened, not taking whole page)
    doc.setFont("helvetica", "bold");
    doc.text("Summary:", 14, startY + 71);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    // Show full summary without limiting lines
    const splitSummary = doc.splitTextToSize(data.summary, 160);
    doc.text(splitSummary, 14, startY + 81);

    // Page break for Diet Plan
    doc.addPage();

    // Diet Plan Section
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Weekly Diet Plan", 14, 20);
    autoTable(doc, {
      startY: 30,
      head: [
        [
          { content: "Day", styles: { cellWidth: 22 } },
          { content: "Breakfast" },
          { content: "Lunch" },
          { content: "Dinner" },
          { content: "Snacks" },
        ],
      ],
      body: data.diet_plan.map((day) => [
        { content: day.day, styles: { cellWidth: 22 } },
        day.meals.breakfast,
        day.meals.lunch,
        day.meals.dinner,
        day.meals.snacks,
      ]),
      columnStyles: {
        0: { cellWidth: 22 }, // Give more space for Day column
        1: { cellWidth: 38 },
        2: { cellWidth: 38 },
        3: { cellWidth: 38 },
        4: { cellWidth: 38 },
      },
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [0, 102, 204], textColor: 255 },
      alternateRowStyles: { fillColor: [240, 240, 240] },
    });

    // Page break for Workout Plan
    doc.addPage();

    // Workout Plan Section (group exercises per day)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Workout Plan", 14, 20);
    autoTable(doc, {
      startY: 30,
      head: [
        [
          { content: "Day", styles: { cellWidth: 22 } },
          { content: "Exercises" },
        ],
      ],
      body: data.workout_plan.map((day) => [
        { content: day.day, styles: { cellWidth: 22 } },
        day.exercises
          .map(
            (ex) =>
              `${ex.name} (${ex.sets ? ex.sets + " sets, " : ""}${
                ex.repetitions ? ex.repetitions : ""
              }${ex.type ? ", " + ex.type : ""})`
          )
          .join("\n"),
      ]),
      columnStyles: {
        0: { cellWidth: 22 }, // Give more space for Day column
        1: { cellWidth: 150 },
      },
      styles: { fontSize: 10, cellPadding: 3, valign: "top" },
      headStyles: { fillColor: [0, 102, 204], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    // Save file
    doc.save("Personalized_Plan.pdf");
  };

  // If running in browser, fetch icons and then generate content
  if (typeof window !== "undefined") {
    addIcons().then((contentStartY) => generateContent(contentStartY));
  } else {
    // Fallback: just generate content without icons
    generateContent();
  }
};
