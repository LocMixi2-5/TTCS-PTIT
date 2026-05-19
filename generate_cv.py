from fpdf import FPDF

pdf = FPDF()
pdf.add_page()
pdf.set_font("helvetica", "B", 16)
pdf.cell(0, 10, "Software Engineer CV", ln=True, align='C')
pdf.ln(10)

pdf.set_font("helvetica", "B", 12)
pdf.cell(0, 10, "Summary", ln=True)
pdf.set_font("helvetica", "", 12)
pdf.multi_cell(0, 10, "Highly motivated Software Engineer with 4 years of experience building modern web applications. Passionate about scalable architecture and AI engineering.")
pdf.ln(5)

pdf.set_font("helvetica", "B", 12)
pdf.cell(0, 10, "Technical Skills", ln=True)
pdf.set_font("helvetica", "", 12)
pdf.multi_cell(0, 10, """- Backend: Python, FastAPI, Node.js, Django
- Frontend: React, Javascript, Tailwind, HTML, CSS
- Databases & Infrastructure: PostgreSQL, SQL, Docker, AWS, Git
- Data & AI: Machine Learning, NLP, Pandas, Numpy""")
pdf.ln(5)

pdf.set_font("helvetica", "B", 12)
pdf.cell(0, 10, "Experience", ln=True)
pdf.set_font("helvetica", "B", 11)
pdf.cell(0, 10, "Senior Developer | Tech Corp Inc. (2022 - Present)", ln=True)
pdf.set_font("helvetica", "", 11)
pdf.multi_cell(0, 8, "- Designed and implemented microservices using Python and FastAPI.\n- Built responsive user interfaces with ReactJS and Tailwind CSS.\n- Optimized PostgreSQL databases for high performance and deployed using Docker on AWS.")

pdf.output("test_cv.pdf")
print("test_cv.pdf created successfully.")
