import multer from 'multer';
import path from 'path';

// Configuração do armazenamento
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Pasta onde as fotos serão salvas
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname); // Extrai a extensão do arquivo
        cb(null, file.fieldname + '-' + uniqueSuffix + ext); // Nome do arquivo
    },
});

// Filtro para aceitar apenas imagens
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true); // Aceita o arquivo
    } else {
        cb(new Error('Apenas imagens são permitidas!'), false); // Rejeita o arquivo
    }
};

// Configuração do multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }, // Limite de 10MB por arquivo
});

export default upload;