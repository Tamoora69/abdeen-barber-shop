import { supabase } from '../../../lib/supabase';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'DELETE') {
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id);

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ message: 'Appointment deleted successfully' });
  } else {
    res.setHeader('Allow', ['DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
