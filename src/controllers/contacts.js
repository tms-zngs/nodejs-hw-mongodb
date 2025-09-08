import {
  createContact,
  getAllContacts,
  getContactById,
  deleteContact,
  updateContact,
} from '../services/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import createHttpError from 'http-errors';
import { parseSortParams } from '../utils/parseSortParams.js';
import { ContactsCollection } from '../db/models/contact.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { getEnvVar } from '../utils/getEnvVar.js';

export const getContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);

  const filter = { userId: req.user._id };

  const contacts = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    userId: req.user._id,
  });

  const totalItems = await ContactsCollection.countDocuments(filter);
  const totalPages = Math.max(1, Math.ceil(totalItems / perPage));
  const hasPreviousPage = page > 1;
  const hasNextPage = page < totalPages;

  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: {
      data: contacts,
      page,
      perPage,
      totalItems,
      totalPages,
      hasPreviousPage,
      hasNextPage,
    },
  });
};
export const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId, req.user._id);

  if (!contact) {
    return next(createHttpError(404, 'Contact not found'));
  }

  res.json({
    status: 200,
    message: 'Successfully found contact!',
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  let photoUrl;

  if (req.file) {
    const useCloud = getEnvVar('ENABLE_CLOUDINARY', 'false') === 'true';
    photoUrl = useCloud
      ? await saveFileToCloudinary(req.file)
      : await saveFileToUploadDir(req.file);
  }

  const contact = await createContact({
    ...req.body,
    userId: req.user._id,
    ...(photoUrl ? { photo: photoUrl } : {}),
  });

  res.status(201).json({
    status: 201,
    message: 'Successfully created contact!',
    data: contact,
  });
};

export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await deleteContact(contactId, req.user._id);

  if (!contact) {
    return next(createHttpError(404, 'Contact not found'));
  }

  res.status(204).send();
};

export const patchContactController = async (req, res, next) => {
  const { contactId } = req.params;

  const update = { ...req.body };

  if (req.file) {
    const useCloud = getEnvVar('ENABLE_CLOUDINARY', 'false') === 'true';
    update.photo = useCloud
      ? await saveFileToCloudinary(req.file)
      : await saveFileToUploadDir(req.file);
  }

  const contact = await updateContact(contactId, update, req.user._id);

  if (!contact) {
    return next(createHttpError(404, 'Contact not found'));
  }

  res.json({
    status: 200,
    message: 'Successfully updated contact!',
    data: contact,
  });
};
