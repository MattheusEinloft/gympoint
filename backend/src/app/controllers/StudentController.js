import * as Yup from 'yup';
import Student from '../models/Student';

class StudentController {
  async index(req, res) {
    const students = await Student.findAll({
      attributes: ['id', 'name', 'email', 'age', 'weight', 'height']
    });

    return res.json(students);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      age: Yup.number().required(),
      weight: Yup.number().required(),
      height: Yup.number().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const studentExists = await Student.findOne({
      where: { email: req.body.email }
    });

    if (studentExists) {
      return res.status(400).json({ error: 'Student already exists.' });
    }

    const { id, name, email, age, weight, height } = await Student.create(
      req.body
    );

    return res.json({
      id,
      name,
      email,
      age,
      weight,
      height
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      age: Yup.number(),
      weight: Yup.number(),
      height: Yup.number()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email } = req.body;

    const student = await Student.findByPk(req.params.id);

    /**
     * Check if student exists
     */
    if (!student) {
      return res.status(400).json({ error: 'Student does not exists' });
    }

    /**
     * Check if email was informed and if is different than the actual email
     */
    if (email && email !== student.email) {
      const studentEmailExists = await Student.findOne({
        where: { email }
      });

      if (studentEmailExists) {
        return res
          .status(401)
          .json({ error: 'Another student with this email already exists.' });
      }
    }

    const { id, name, age, weight, height } = await student.update(req.body);

    return res.json({
      id,
      name,
      email,
      age,
      weight,
      height
    });
  }

  async delete(req, res) {
    const student = await Student.findByPk(req.params.id);

    /**
     * Check if student exists
     */
    if (!student) {
      return res.status(400).json({ error: 'Student does not exists' });
    }

    student.destroy();

    return res.json(student);
  }
}

export default new StudentController();
