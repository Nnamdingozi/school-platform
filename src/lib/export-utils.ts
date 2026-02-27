export const downloadUserTemplate = () => {
    const headers = "name,email,role\n";
    const example = "John Doe,john@example.com,STUDENT\nJane Smith,jane@teacher.com,TEACHER";
    const blob = new Blob([headers + example], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", "user_import_template.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };