const router = require('express').Router();
const prisma = require('../../../infrastructure/database/prisma');

// Get persons by project ID (with join)
router.get('/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    
    // Join project_persons with persons to get all persons in a project
    const projectPersons = await prisma.projectPerson.findMany({
      where: { project_id: String(projectId) },
      include: {
        person: true, // This includes all person data
      },
    });

    // Extract just the persons data
    const persons = projectPersons.map(pp => pp.person);
    
    return res.json({ success: true, data: persons, count: persons.length });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Erro interno' });
  }
});

module.exports = router;
